import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const CommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  
  text: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Comfortaa_400Regular',
  },
  
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    fontFamily: 'Comfortaa_700Bold',
    marginBottom: 16,
  },
  
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    fontFamily: 'Comfortaa_700Bold',
    marginBottom: 12,
  },
  
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Comfortaa_700Bold',
  },
  
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
