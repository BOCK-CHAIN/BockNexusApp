import { Platform } from "react-native" 
//FOR EMULATOR OR SIMULATOR DEVICE + 
export const BASE_URL = Platform.OS == 'android' ? 
'http://10.0.2.2:3000': 
'http://localhost:3000' ;
//FOR PHYSICAL DEVICE  
// export const BASE_URL = 'http://34.60.197.27:3000'

// Alternative configurations for different setups:
// For Android emulator with localhost:
// export const BASE_URL = Platform.OS == 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000'

// For Android emulator with your computer's IP:
// export const BASE_URL = Platform.OS == 'android' ? 'http://192.168.1.4:3000' : 'http://localhost:3000'

// For physical device on same network:
// export const BASE_URL = 'http://192.168.1.4:3000'
