import {Appearance, StyleSheet} from 'react-native';

const colorScheme = Appearance.getColorScheme();
const isDarkMode = colorScheme === 'dark';

const styles = StyleSheet.create({
  container: {
    backgroundColor: isDarkMode ? '#121212' : '#fff',
    width: '40%',
    height: 130,
    borderRadius: 10,
    opacity: 0.8,
    padding: 10,
    borderWidth: 1,
    borderColor: isDarkMode ? '#121212' : '#EEEEEE',
    boxShadow: '10px 10px 40px 0px rgba(212,212,212,1)',
  },
  text: {
    fontSize: 14,
  },
  buttonContainer: {
    width: '100%',
    height: 40,
    opacity: 0.8,
    marginTop: 10,
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: 40,
    height: 40,
    margin: 5,
  },
});

export default styles;
