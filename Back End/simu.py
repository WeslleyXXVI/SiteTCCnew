import sqlite3
import random
import time

# Create a SQLite database connection
conn = sqlite3.connect('sensor_data.db')
cursor = conn.cursor()

# Create a table to store sensor data
cursor.execute('''
    CREATE TABLE IF NOT EXISTS sensor_data (
        id INTEGER PRIMARY KEY,
        inclination REAL,
        humidity REAL,
        pressure REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
''')

# Simulate sensor data insertion
while True:
    # Generate random sensor data
    inclination = random.uniform(0, 90)
    humidity = random.uniform(0, 100)
    vibration = random.uniform(900, 1100)

    # Insert data into the database
    cursor.execute('''
        INSERT INTO sensor_data (inclination, humidity, vibration)
        VALUES (?, ?, ?);
    ''', (inclination, humidity, vibration))

    # Commit the changes
    conn.commit()

    # Print a message to indicate that data has been inserted
    print(f'Data inserted: Inclination={inclination:.2f}, Humidity={humidity:.2f}%, Vibration={vibration:.2f} m/s²')

    # Wait for 1 second before inserting the next set of data
    time.sleep(1)

# Close the database connection
conn.close()