import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
// import Control from '@/components/Control';
import Editor from '@/components/Editor';
import IdeEditor from '@/components/IdeEditor';
import Paint from '@/components/Paint';
import Emulator from '@/components/Emulator';
// import EmulatorEdit from '@/components/EmulatorEdit';
import Blockly from '@/components/Blockly';
import Teach from '@/components/Teach';
import EditHome from '@/components/EditHome';
import Setting from '@/components/Setting';
import Setting1 from '@/components/Setting-1';
import AppStore from '@/components/AppStore';
import AppDetail from '@/components/appStore/AppDetail';
import LogInfo from '@/components/Setting/LogInfo';
import SoftwareUpdate from '@/components/Setting/SoftwareUpdate';
import StudioInfo from '@/components/Setting/StudioInfo';
import AppSubmit from '@/components/appStore/AppSubmit';
import WebSSH from '@/components/WebSSH';
import NetWork from '@/components/NetWork';
import Debug from '@/components/Setting/Debug';
import Profile from '@/components/Profile/userProfile';
// import JoystickPage from '@/components/JoystickPage';
import Test from '@/components/Test';
import initialPage from '@/components/Setting/initialPage';
import Control from '@/components/Control';
import Blockly1 from '@/components/Blockly-test';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/Test',
      name: 'Test',
      component: Test,
    },
    // {
    //   path: '/home',
    //   name: 'Home',
    //   component: Home,
    // },
    {
      path: '/EditHome',
      name: 'EditHome',
      component: EditHome,
    },
    {
      path: '/setting',
      component: Setting,
      name: 'Setting',
    },
    {
      path: '/logInfo',
      name: 'LogInfo',
      component: LogInfo,
    },
    {
      path: '/studioInfo',
      name: 'StudioInfo',
      component: StudioInfo,
    },
    {
      path: '/softwareUpdate',
      name: 'SoftwareUpdate',
      component: SoftwareUpdate,
    },
    {
      path: '/AppStore',
      name: 'AppStore',
      component: AppStore,
    },
    {
      path: '/AppDetail',
      name: 'AppDetail',
      component: AppDetail,
    },
    {
      path: '/AppSubmit',
      name: 'AppSubmit',
      component: AppSubmit,
    },
    // {
    //   path: '/control',
    //   name: 'Control',
    //   component: Control,
    // },
    {
      path: '/IdeEditor',
      name: 'IdeEditor',
      component: Editor,
    },
    {
      path: '/editor',
      name: 'Editor',
      component: IdeEditor,
    },
    {
      path: '/paint',
      name: 'Paint',
      component: Paint,
    },
    {
      path: '/emulator',
      name: 'Emulator',
      component: Emulator,
    },
    // {
    //   path: '/emulator-edit',
    //   name: 'EmulatorEdit',
    //   component: EmulatorEdit,
    // },
    {
      path: '/blockly',
      name: 'Blockly',
      component: Blockly,
    },
    {
      path: '/teach',
      name: 'Teach',
      component: Teach,
    },
    {
      path: '/terminal',
      name: 'Terminal',
      component: WebSSH,
    },
    {
      path: '/network',
      name: 'NetWork',
      component: NetWork,
    },
    {
      path: '/debug',
      name: 'Debug',
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
    },

    // {
    //   path: '/joystick',
    //   name: 'Joystick',
    //   component: JoystickPage,
    // },
    {
      path: '/setting1',
      component: Setting1,
      name: 'Setting1',
    },
    {
      path: '/initialPage',
      component: initialPage,
      name: 'initialPage',
    },
    {
      path: '/control',
      component: Control,
      name: 'Control',
    },
    {
      path: '/Blockly-test',
      component: Blockly1,
      name: 'Blockly-test',
    },
  ],
});
