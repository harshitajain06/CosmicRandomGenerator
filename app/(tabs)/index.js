import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Dimensions} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Logo from '@/assets/images/slrndm.png';
import BackgroundImage from '@/assets/images/smoke.jpg';
import CopyIcon from '@/assets/images/copy.png';

const { width } = Dimensions.get('window');

const App = () => {
  const [jsonData, setJsonData] = useState(null);
  const [randomNumber, setRandomNumber] = useState(null);
  const [digits, setDigits] = useState(4); // Initial number of digits
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchFileFromURL();
  }, []);

  const fetchFileFromURL = () => {
    fetch('https://hesperia.gsfc.nasa.gov/fermi/gbm/qlook/fermi_gbm_flare_list.txt')
      .then(response => response.text())
      .then(textData => {
        const parsedData = parseTxtToJson(textData);
        setJsonData(parsedData);
      })
      .catch(error => console.error('Error fetching file:', error));
  };

  const parseTxtToJson = (fileContent) => {
    const lines = fileContent.split(/\r?\n/);
    const data = [];

    for (const line of lines) {
      const flareData = line.trim().split(/\s+/);
      const startTime = parseFloat(flareData[1]);
      const peakIntensity = parseFloat(flareData[4]);
      const totalCounts = parseFloat(flareData[6]);
      const sunward = parseFloat(flareData[8]);

      const flareEntry = {
        Flare: flareData[0],
        "Start time (s)": startTime,
        "Peak (c/s)": peakIntensity,
        "End (s)": flareData[2],
        "Duration (s)": flareData[3],
        "Peak Counts": totalCounts,
        "Total Counts": totalCounts,
        "Sunward Flux": sunward,
        Trigger: flareData[7],
        "RHESSI Flare #": flareData[9],
        Detectors: flareData[10],
      };

      data.push(flareEntry);
    }

    return data;
  };

  const generateRandomNumber = () => {
    if (jsonData) {
      const randomIndex = Math.floor(Math.random() * jsonData.length);
      const randomEntry = jsonData[randomIndex];
      const randomCount = randomEntry["Peak Counts"];

      const k_ch = Math.random() * (10 - 3.6) + 3.6;

      const convertToDecimal = (num) => {
        const div = 10 ** Math.floor(Math.log10(num) + 1);
        const dec = num / div;
        return dec;
      };

      const chaos_calculate = (k, num) => {
        const eq = k * num * (1 - num);
        return eq % 1.0;
      };

      const numDec = convertToDecimal(randomCount);
      let final_ls = [numDec];

      for (let i = 0; i < 100; i++) {
        final_ls.push(chaos_calculate(k_ch, final_ls[final_ls.length - 1]));
      }

      const ch3 = Math.floor(Math.random() * (final_ls.length - 1)) + 1;
      const last = final_ls[ch3];
      let newX = last;

      while (newX <= 10 ** (digits - 1)) {
        newX *= 10;
      }

      setRandomNumber(parseInt(newX));
    }
  };

  const increaseDigits = () => {
    setDigits(digits + 1);
  };

  const decreaseDigits = () => {
    if (digits > 1) {
      setDigits(digits - 1);
    }
  };

  const copyToClipboard = () => {
    if (randomNumber !== null) { // Ensure randomNumber is not null
      Clipboard.setString(randomNumber.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          {/* Logo */}
          <Image source={Logo} style={[styles.logo, { width: width }]} />

          <Text style={styles.title}>Solar Random</Text>
          <Text style={styles.subtitle}>Random Number Generator</Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={copyToClipboard}
          >
            <Image source={CopyIcon} style={styles.copyIcon} />
            {copied && <Text style={styles.copyText}>Copied to Clipboard!</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateRandomNumber}
          >
            <Text style={styles.generateButtonText}>Generate</Text>
          </TouchableOpacity>
          <View style={styles.digitsContainer}>
            <TouchableOpacity style={styles.button} onPress={decreaseDigits}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.digits}>{digits}</Text>
            <TouchableOpacity style={styles.button} onPress={increaseDigits}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
          {randomNumber && (
            <View style={styles.randomContainer}>
              <Text style={styles.randomTitle}>Random Number:</Text>
              <Text style={styles.randomNumber}>{randomNumber}</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
  },
  generateButton: {
    backgroundColor: 'skyblue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    marginBottom: 20,
  },
  generateButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  digitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  digits: {
    fontSize: 18,
    marginHorizontal: 20,
    color: '#fff',
  },
  button: {
    backgroundColor: 'lightgray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 18,
  },
  randomTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#fff',
  },
  randomNumber: {
    fontSize: 30,
    marginBottom: 20,
    alignItems: 'center',
    color: '#fff',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  copyIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    tintColor: '#fff',
  },
  copyText: {
    fontSize: 14,
    color: '#fff',
  },
  randomContainer: {
    alignItems: 'center'
  }
});

export default App;