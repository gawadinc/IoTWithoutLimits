#include "Arduino.h"
#include "Board.h"
#include "Helium.h"
#include <ArduinoNunchuk.h>

Helium  helium(&atom_serial);
Channel channel(&helium);

ArduinoNunchuk nunchuk = ArduinoNunchuk();

void report_status(int status)
{
    if (helium_status_OK == status)
    {
        Serial.println("Succeeded");
    }
    else
    {
        Serial.println("Failed");
    }
}

void report_status_result(int status, int result)
{
    if (helium_status_OK == status)
    {
        if (result == 0)
        {
            Serial.println("Succeeded");
        }
        else {
            Serial.print("Failed - ");
            Serial.println(result);
        }
    }
    else
    {
        Serial.println("Failed");
    }
}

void
setup()
{
    Serial.begin(9600);
    nunchuk.init();
    Serial.println("Starting");

    // Begin communication with the Helium Atom
    // The baud rate differs per supported board
    // and is configured in Board.h
    helium.begin(HELIUM_BAUD_RATE);

    // Connect the Atom to the Helium Network
    Serial.print("Connecting - ");
    int status = helium.connect();
    // Print status
    report_status(status);

    // Begin communicating with the channel. This should only need to
    // be done once.
    //
    // NOTE: Please ensure you've created a channel called "Helium
    // Cloud MQTT" called in the Helium Dashboard.
    int8_t result;
    Serial.print("Creating Channel - ");
    status = channel.begin("vr_control", &result);
    // Print status and result
    report_status_result(status, result);
}

void loop()
{
    nunchuk.update();
    
    String accelX = String(nunchuk.accelX);
    String accelY = String(nunchuk.accelY);
    String accelZ = String(nunchuk.accelZ);
    String formattedString = "{\"accelX\":" + accelX + ",\"accelY\":" + accelY + ",\"accelZ\":" + accelZ + "}";
    Serial.println(formattedString);
    char data[50];
    formattedString.toCharArray(data, 50);
    int8_t result;
    Serial.print("Send to Helium - ");
    channel.send(data, strlen(data), &result);
    
    report_status_result(status, result);
    delay(1000);
}