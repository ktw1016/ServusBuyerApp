import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

jest.mock('react-native-gesture-handler', () => {
    const View = require('react-native/Libraries/Components/View/View');
    return {
      Swipeable: View,
      DrawerLayout: View,
      State: {},
      ScrollView: View,
      Slider: View,
      Switch: View,
      TextInput: View,
      ToolbarAndroid: View,
      ViewPagerAndroid: View,
      DrawerLayoutAndroid: View,
      WebView: View,
      NativeViewGestureHandler: View,
      TapGestureHandler: View,
      FlingGestureHandler: View,
      ForceTouchGestureHandler: View,
      LongPressGestureHandler: View,
      PanGestureHandler: View,
      PinchGestureHandler: View,
      RotationGestureHandler: View,
      /* Buttons */
      RawButton: View,
      BaseButton: View,
      RectButton: View,
      BorderlessButton: View,
      /* Other */
      FlatList: View,
      gestureHandlerRootHOC: jest.fn(),
      Directions: {},
    };
  });

  jest.mock('react-native-awesome-card-io', () => ({
    CardIOUtilities: {
      preload: jest.fn(() => Promise.resolve('the response')),
    },
  }));

  jest.mock('react-native-image-picker', () => ({
    ImagePicker: {
      preload: jest.fn(() => Promise.resolve('the response')),
    },
  }));

  jest.mock('react-native-firebase', () => ({
    firebase: {
      preload: jest.fn(() => Promise.resolve('the response')),
    },
  }));

  //jest.mock('node-fetch', ()=>jest.fn())
