/**
 * Created by alex on 2017/1/22.
 */
const en = {
  language: 'en',
  menu: {
    about: {
      label: 'uArmStudio',
      submenu: {
        about: 'About uArmStudio',
        checkforupdates: 'Check for Updates...',
        services: 'Services',
        hide: 'Hide uArmStudio',
        hideothers: 'Hide Others',
        unhide: 'Show All',
        quit: 'Quit uArmStudio',
      },
    },
    edit: {
      label: 'Edit',
      submenu: {
        undo: 'Undo',
        redo: 'Redo',
        cut: 'Cut',
        copy: 'Copy',
        paste: 'Paste',
        delete: 'delete',
        selectall: 'Select All',
      },
    },
    window: {
      label: 'Window',
      submenu: {
        resetzoom: 'Reset Zoom',
        zoomin: 'Zoomin',
        zoomout: 'Zommout',
        togglefullscreen: 'Full Screen',
        minimize: 'Minimize',
        front: 'Bring All to Front',
      },
    },
    debug: {
      label: 'Debug',
      submenu: {
        cura: 'Open Cura',
        killcore: 'Kill uArm Core',
        toggledevtools: 'Open Develop tools',
      },
    },
    language: {
      label: 'Language',
      submenu: {
        chinese: '简体中文',
        english: 'English',
      },
    },
    help: {
      label: 'Help',
      submenu: {
        faq: 'FAQ',
        feedback: 'Feedback',
        troubleshoot: 'Troubleshoot',
        homefolder: 'Open Home Folder',
      },
    },
  },
  common: {
    tooltip: {
      sync: 'Sync',
      edit: 'Edit',
      rename: 'Rename',
      export: 'Export',
      import: 'Import',
      new: 'New',
      save: 'Save',
      saveas: 'Duplicate',
      run: 'Run',
      stop: 'stop',
      paused: 'paused',
    },
    done: 'Done',
    close: 'Close',
    dialog: {
      serverConnect: {
        title: 'Connected!',
        content: 'uArm Server connected!',
      },
      serverDisconnect: {
        title: 'Oops...',
        content: 'uArm Server Disconnected!',
      },
      printStopped0: 'Drawing Stopped!',
      printStopped1: 'Engraving Stopped!',
      stopPrint0: 'Are you sure to stop drawing?',
      stopPrint1: 'Are you sure to stop engraving?',
      stopPrintBtn: 'Stop',
      continuingPrintBtn: 'Continue',
      snackDisconnect: 'Disconnected', // USB plug out
      snackConnect: 'Connected', // USB plug in
      downloadProgressTitle: 'Downloading, Please wait...',
    },
  },
  userPage: {
    header: 'PROFILE',
    status: {
      connection: 'Device Connected',
      disconnection: 'Device Disconnected',
    },
    changeAvatar: 'Change',
    name: 'Name',
    email: 'Email',
    button: {
      edit: 'Edit',
      signout: 'Sign Out',
      save: 'Save',
    },
  },
  loginPage: {
    signin: 'SIGN IN',
    register: 'REGISTER',
    email: 'Email',
    emailHint: 'Please enter your email',
    password: 'Password',
    repassword: 'Confirm Password',
    remember: 'Keep me logged in',
    forget: 'Forget your password?',
    switchRegister: 'New here?<br>Register now',
    switchLogin: 'Have Account?<br>Sign in',
    birth: 'Date of Birth',
    country: 'Country',
    gender: 'Gender',
    select: 'Select',
    promotion: 'Keep me updated with the latest news(products, discount, etc)',
    agreePolicy1: 'I agree with ',
    agreePolicy2: 'UFACTORY <span>Terms & Conditions</span> and <span>Privacy Policy</span>.',
    validation: {
      emailFormat: 'Invalid Email address',
      emailRegisted: 'This email is already registered.',
      serverUnavailable: 'Server is unavailable',
      networkingIssue: 'Can not connect to server. Please connect to Internet and try again.',
      registerFail: 'Register Fail',
      passwordFormat: 'Please enter 6 characters at least.',
      passwordMatch: 'Password is not match',
      loginFail: 'Email or password is incorrect',
      countryEmpty: 'Please select your country',
      genderEmpty: 'Please select your gender',
      birthEmpty: 'Please enter a valid birthday',
      agreePolicy: 'Please agree with our Terms & Conditions and Privacy Policy if you want to continue. Thanks. ',
    },
    reset: 'Reset password',
    cancel: 'Cancel',
    emailSent: 'Email Sent!',
    emailSentText: 'Please click the link in the email to reset password.',
    registerSuccess: 'Done!',
    emailConfrim: 'Confirmation email sent!',
    enterStudio: 'Enter uArm Studio',
    genderList: {
      1: 'Male',
      2: 'Female',
      3: 'Unspecified',
    },
  },
  settingPage: {
    title: 'SETTING',
    restart: 'Restart Required',
    release: 'Publish Date',
    moreinfo: 'Learn More',
    deviceName: 'Device',
    devicePort: 'Serial Port',
    deviceFirmware: 'Firmware',
    deviceSerial: 'Serial No.',
    deviceTab: 'Device',
    updateTab: 'Updates',
    troubleTab: 'Troubleshooting',
    update: 'Update',
    refresh: 'Refresh',
    updateAvailable: ' updates available',
    firmwareAvailable: 'A new version of uArm Firmware is available!',
    updateNow: 'Update Now',
    updateLater: 'Remind Me Later',
    firmwareCompleted: 'Firmware Upgrade Completed',
    firmwareFailed: 'Firmware Upgrade Failed',
    changeLog: 'ChangeLog',
    OK: 'OK',
    updated: 'Updated',
    upgrading: 'Upgrading',
    cacheCleaned: 'Cache Cleaned',
  },
  troubleshooting: {
  },
  homePageView: {
    name: 'xArm',
    intro: {
      slogan: 'Getting Started with xArm Studio',
      btnStart: 'Start',
    },
    hardware: {
      statusOff: 'Disconnected',
      statusOn: 'Connected',
      portName: 'Port',
      firmwareVersion: 'Firmware',
      hardwareVersion: 'Model',
      connectBtn: 'Connect',
      connecting: 'Connecting',
      disconnect: 'Disconnect',
      connected: 'Connected',
      disconnected: 'Disconnected',
      setting: 'Setting',
    },
    tabText: {
      tab2: 'Control',
      tab3: 'Teach & Play',
      tab5: 'Draw/Laser',
      '3D-Printing': '3D Printing',
    },
    navigators: {
      blockly: './app/blockly/index.html?lang=en',
    },
    getStart: {
      getStart01Text01: 'Getting Started with uArm Studio',
      getStart01Text02: 'Hardware Preparation',
      getStart01Text02A: 'Power On and Connect:',
      getStart01Text03: 'Plug in the power cable.',
      getStart01Text04: 'Press down the powerbutton.',
      getStart01Text05: 'Connect to the computer via USB.',
      getStart02Text02: 'End-effector',
      // getStart02Text03: 'How to install?',
      getStart02Text03: 'How to install? Please refer to Quick-Start Guide.',
      getStart02Text04: 'Only for uArm Swift Pro',
      getStart03Text01: 'What can you do with uArm Studio?',
      getStart03Text02: 'Control uArm in real time',
      getStart03Text03: 'Control:',
      getStart03Text04: 'Mouse control & Keyboard control',
      getStart03Text05: 'Keyboard control',
      getStart03Text06: '（Currently only for uArm Swift）',
      getStart04Text02: 'Control uArm in real time',
      getStart04Text03: 'Leap Motion:',
      getStart04Text04: 'Gesture control',
      getStart04Text05: '（Currently only for uArm Swift）',
      getStart05Text02: 'Programme your uArm',
      getStart05Text03: 'Blockly:',
      getStart05Text04: 'Blockly-based visual programming specially designed for uArm',
      getStart05Text05: 'Drag and drop blocks to create your robotic project',
      getStart05Text06: 'Programme basic movements',
      getStart06Text04: 'Blockly-based visual programming specially designed for uArm',
      getStart06Text05: 'Drag and drop blocks to create your robotic project',
      getStart06Text06: 'Customise your way of controlling',
      getStart07Text04: 'Blockly-based visual programming specially designed for uArm',
      getStart07Text05: 'Drag and drop blocks to create your robotic project',
      getStart07Text06: 'Apply movements recorded in Teach & Play section',
      getStart08Text03: 'Teach & Play:',
      getStart08Text04: 'Teach uArm by hand',
      getStart08Text05: 'Make a recording, and replay it anytime',
      getStart09Text02: 'Drawing/laser Engraving',
      getStart09Text03: 'Draw/Laser:',
      getStart09Text04: 'Insert text/shapes/image, and let uArm draw/engrave it for you',
      getStart09Text05: '(Only for uArm Swift Pro)',
      getStart10Text02: '3D Printing',
      getStart10Text03: 'Draw/Laser:',
      getStart10Text04: 'uArm Swift Pro is compatible with Cura, a third-party software for 3D printing',
      getStart10Text05: 'Please use the Cura include in the uArm Studio .zip file',
      getStart10Text06: '(Only for uArm Swift Pro)',
      getStart11Text01: 'File Management',
      getStart11Text02: 'Blockly projects: “.xml”files',
      getStart11Text03: 'Teach & Plays projects: “.rec”files',
      getStart11Text04: 'Save your project',
      getStart11Text05: 'Share it with others',
      getStart11Text06: 'Import other projects',
      getStart12Text01: 'Try it out!',
      getStart12Text02: 'Click an icon to enter',
      getStart12Text03: 'uArm Swift',
      getStart12Text04: 'uArm Swift Pro',
      getStart12Text05: 'Blockly',
      getStart12Text06: 'Control',
      getStart12Text07: 'Teach & Play',
      getStart12Text08: 'Draw/Laser',
      getStart12Text09: 'Leap motion',
      getStart12Text10: '3D Printing',
    },
    get3dStart: {
      get3dStart00Text01: 'Install Cura for uArm',
      get3dStart00Text02: '1. Download Cura for uArm',
      get3dStart00Text03: 'https://www.ufactory.cc/#/en/support',
      get3dStart00Text04: '2. Double Click the .dmg/.exe file to install',
      get3dStart00Text05: 'Open Cura',
      // get3dStart00Text06: 'Please don’t touch the metal part of the 3D extruder, which will get extremely hot after heated.',
      get3dStart01Text01: 'Import an STL.file in',
      get3dStart01Text02: 'Cura is a third-party software for 3D printing.',
      get3dStart01Text03: 'Studio will pop up Cura window automatically.',
      get3dStart01Text98: 'Hardware Installation Guide',
      get3dStart01Text99: 'Please don’t touch the metal part of the 3D extruder, which will get extremely hot after heated.',
      get3dStart02Text01: 'Open Printer Monitor',
      get3dStart03Text01: 'Adjust Zero Point',
      get3dStart03Text02: 'Before printing, please Adjust Zero Point to ensure the 3D extruder is TOUCHING the platform.',
      get3dStart04Text01: 'Start Printing!',
    },
    notConnected: 'Please plug in the power cable and connect to the computer via USB',
    goOffline: 'Browse uArm Studio without device',
    checkUpdate: 'Check for Updates',
  },
  BlocklyPageView: {
    tooltip: {
      reset: 'Reset',
      new: 'New',
      save: 'Save',
      saveas: 'Duplicate',
      discard: 'Discard',
      camera: 'Camera',
      run: 'Run',
      sync: 'Sync',
      export: 'Export',
      import: 'Import',
      edit: 'Edit',
    },
    sync: {
      downloadProject: 'Download {} new projects',
      uploadProject: 'Upload {} new projects',
    },
    tabName: {
      JS: 'Javascript',
      XML: 'XML',
      BLOCKS: 'Blocks',
    },
    project: {
      untitledProject: 'Untitled Project',
      editStatus: 'edited',
    },
    leftSide: {
      imageProject: './assets/img/blk-Title_MyProjects.svg',
      imageMission: './assets/img/Title_Missions.svg',
    },
    modalText: {
      example: 'Example',
      gotIt: 'Got it',
    },
    modal1: {
      title: 'Move to',
      leftText: 'Drag uArm to a destination',
      buttonOK: 'Ok',
    },
    modal2: {
      menuButton: 'Menu Button',
      playButton: 'Play Button',
      tipTitle: 'Tips',
      tipContent: 'Use buttons on the base to<br>trigger commands',
      buttonOK: 'Got it',
    },
    modal3: {
      title: 'Let uArm run the movements recorded in "Teach & Play" section.',
      textLeft: 'Record a movement in<br>"Teach & Play" section.',
      textRight: 'Apply the recording in<br>your Blockly project.',
      buttonOK: 'Record Now',
      buttonCancel: 'Record Later',
    },
    modal4: {
      title: 'Let uArm move relatively in absolute coordinates.',
    },
    modal5: {
      title: 'Let uArm move relatively in polar coordinates.',
      backward: 'Stretch Backward',
      forward: 'Stretch Forward',
    },
    modal6: {
      title: 'Press suction cup to trigger commands.',
    },
    mission: {
      startMoving: 'Mission 1 : Start Moving',
      pickAndPlace: 'Mission 2 : Pick and place',
      applyRecorings: 'Mission 3 : Apply Recorings',
      misstionTitle1: 'Mission 1 : START MOVING',
      misstionTitle2: 'Mission 2 : PICK AND PLACE',
      misstionTitle3: 'Mission 3 : APPLY RECORDINGS',
      mission01Text01: 'Please ensure your uArm is powered on and connected with uArm studio',
      mission01Text02: 'Step 1 : Set home position as the initial position',
      mission01Text03: '1. Drag “Reset”',
      mission01Text04: 'Step 2 : Set a destination',
      mission01Text05: '1. Drag “Move to”',
      mission01Text05A: '2. Keep the base fixed, and drag uArm to any position',
      mission01Text06: '3. Click “OK” to save the destination',
      mission01Text07: '4. Click',
      mission01Text08: 'to make uArm move',
      mission01Text09: 'Step 3 : Make it nod',
      mission01Text10: '1. Drag “Move [Down]”',
      mission01Text11: '2. Drag “Move [Up]”',
      mission01Text12: '3. Click',
      mission01Text13: 'to make uArm nod',
      mission01Text14: '4. Drag “Repeat[ ]times”',
      mission01Text15: '5. Click',
      mission01Text16: 'to make uArm nod twice',
      mission01Text17: 'Step 4 : Add event',
      mission01Text18: '1. Drag “When [Y] is pressed”',
      mission01Text19: '2. Click',
      mission01Text20: 'and type Y in keyboard to make ',
      mission01Text21: 'Final Step : Now name and save your project',
      mission02Text01: 'Step 1 : Set home position as the initial position',
      mission02Text02: '1. Drag “Reset”',
      mission02Text03: 'Step 2 : Move to an object',
      mission02Text04: '1. Drag “move to”',
      mission02Text05: '2. Keep the base fixed, and drag uArm to let it touch the flat surface of an object',
      mission02Text06: '(Please ensure the surface is air proof)',
      mission02Text07: '3. Click “OK” to save the destination',
      mission02Text08: 'Step 3 : Pick Up',
      mission02Text09: '1. Drag “Suction Cup ON”',
      mission02Text10: '2. Drag “Move [Up]”',
      mission02Text11: 'Step 4 : Move the object',
      mission02Text12: '1. Drag “move to”',
      mission02Text13: '2. Drag uArm to the place you want to drop the object',
      mission02Text14: '3. Click “OK” to save the destination',
      mission02Text15: 'Step 5 : Place Down',
      mission02Text16: '1. Drag “Suction Cup On” and untick the check box.',
      mission02Text17: '2. Click',
      mission02Text18: 'to make uArm pick and place',
      mission02Text19: 'Final Step : Name and save your project. You can replay it anytime.',
      mission03Text01: 'Step 1 : Make a recording',
      mission03Text02: '1. Go to',
      mission03Text02A: 'Teach & Play',
      mission03Text03: 'section, drag your uArm to make a recording. For example, “teach”uArm to pick and place.',
      mission03Text04: '2. Name and save your recording',
      mission03Text05: 'Step 2 : Apply the recording in Blockly',
      mission03Text06: '1. Drag “play recording”, the name of the recording will appear in the list automatically.',
      mission03Text07: '2. Click',
      mission03Text08: 'to run',
      mission03Text09: 'Step 3 : Add event. Try “face recognition”!',
      mission03Text10: 'Now add more commands to make your project interesting.',
      mission03Text11: '1. Drag “when face is recognised”.',
      mission03Text12: '(You may use your laptop’s built-in camera, or plug in a webcam.)',
      mission03Text13: '2. Click',
      mission03Text14: 'to let uArm pick and place as soon as a face is spotted',
      mission03Text15: 'Final Step : Name and save your project. You can replay it anytime.',
    },
    sidebar: {
      project_name: 'My Project',
      mission_name: 'New task',
    },
    tip_dialog: {
      btn: {
        next: 'Next',
        close: 'Close',
        ok: 'Ok',
        cancel: 'Cancel',
      },
      not_show: 'Don’t show again',
      grove: {
        title: 'Grove Installation Notice',
        text1: 'Please <span>Power Off</span> uArm before plugging in Grove modules (Grove does not support hot swapping) ',
        text2: 'Please plug the Grove modules in the Right Port.',
        color_sensor: 'Color Sensor',
        temperature_sensor: 'Temperature &Humidity Sensor',
        lcd_sensor: 'LCD RGB Backlight Sensor',
        gesture_sensor: 'Gesture Sensor',
        base_extension: 'Base Seeed Grove Extension:',
        front_extension: 'Front Seeed Grove Extension:',
        electromagnet: 'Electromagnet',
        pir_sensor: 'PIR Motion Sensor',
        fan_sensor: 'Mini Fan Sensor',
        ranger: 'Ultrasonic Ranger',
        refer_to: 'For complete installation guide, Please refer to the user manual<br/> www.ufactory.cc',
      },
      gesture: {
        title1: 'Please connect Gesture Sensor with the base of uArm.',
        title2: 'Gesture sensor is able to sense motions in 8 directions:',
        up: 'Up',
        right: 'Right',
        down: 'Down',
        left: 'Left',
        clockwise: ' Clockwise',
        counter: ' Counterclockwise',
        forward: ' Forward',
        backward: 'Backward',
      },
      color: {
        title1: 'Please connect Color Sensor with the base of uArm.',
        title2: 'Tips ',
        text1: '1. Please make sure the background of the sensed object is white, clear and bright.',
        text2: '2.If you want to eliminate the impact of the environment (background color, light, etc.)',
        please: 'Please:',
        please1: 'Turn on the LED on the Grove',
        please2: 'Let the object touch the sensor',
      },
      ultrasonic_range: {
        title: 'Please connect Ultrasonic Ranger with D8/D9 port.',
      },
      mini_fan: {
        title: 'Please connect MIni Fan with the D8/D9 port.',
      },
    },
  },
  controlApp: {
    wristTurn: 'Wrist Turn',
    suctionGripperSwitch: 'Suction/Gripper',
    keySpace: 'SPACE',
    reset: 'Reset',
    slow: 'Slow',
    speed: 'Speed',
    acceleration: 'Acceleration',
    fast: 'Fast',
    titleImagePath: './assets/img/CONTROL.svg',
    guideTexta: 'Tips: Use these keyboard shortcuts along with your mouse.',
    guideTextb: 'Tips: Adjust the height(Z value) via your mouse wheel.',
  },
  recordApp: {
    titleImagePath: './assets/img/TEACHPLAY.svg',
    imageProject: './assets/img/Title_My Projects.svg',
    button: {
      start: 'Start Recording',
      restart: 'Restart',
      finish: 'Finish',
      discard: 'Discard',
      save: 'Save',
    },
    text: {
      speed: 'Speed',
      times: 'Times',
      loop: 'Loop',
      progress_status: 'Ready',
      ready: 'Ready to record:',
      recording: 'Recording',
      stopped: 'Stopped',
      playing: 'Replaying',
      save_successful: 'Save Successful',
      delete_successful: 'Delete Successful',
      rename_successful: 'Rename Successful',
      previewing: 'Previewing',
      preview: 'Preview',
    },
    dialog: {
      save: {
        html: 'Would you like to save your recording before continuing?',
        okButton: 'Save',
        cancelButton: 'Cancel',
      },
      name: {
        html: 'Please input a name for the recording',
        okButton: 'Submit',
        cancelButton: 'Cancel',
        emptyAlert: 'You haven\'t input anything',
        existedAlert: 'This name is taken. Please rename your recording.',
      },
      success: {
        title: 'Recording Saved',
        content: 'File Name:',
      },
    },
  },
  dialog: {
    syncProject: {
      title: 'The filename below is found both on the Cloud and on your computer: [{}] ',
      text: 'Which one do you want to keep?',
      overwriteLocal: 'Cloud',
      overwriteRemote: 'Local',
    },
    save: {
      html: 'Would you like to save your project?',
      okButton: 'Save',
      cancelButton: 'Cancel',
    },
    runProject: {
      title: 'Oops...',
      text: 'You didn\'t add any blocks.',
    },
    notConnected: {
      title: 'Oops... uArm is not connected.',
      html: 'Please ensure:<div class="text-left" style="margin-left:12vw">- USB is plugged in.<br>' +
      '- Power cable is plugged in.<br>- Power button is pressed down.</div>',
      okbtn: 'OK',
    },
    deleteBlocks: {
      faila: 'Oops...',
      failb: 'No blocks to be deleted!',
      title: 'Delete all blocks',
      text: 'All blocks will be deleted, are you sure?',
      okbtn: 'Yes',
      cancelbtn: 'Cancel',
    },
    failImport: {
      title: 'Sorry',
      html: 'This file can not be imported in Blockly.',
      okbtn: 'OK',
    },
    failExport: {
      title: 'No selected project',
      html: 'No selected project',
      okbtn: 'OK',
    },
    deleteRecord: {
      title: 'Deleted!',
      html: 'Your record has been deleted.',
    },
    nameRecord: {
      title: 'Please input the record name',
      okbtn: 'Submit',
      cancelbtn: 'Cancel',
      faila: 'You havn\'t input anything',
      failb: 'record name is taken. Please rename your record.',
      saved: 'Record Saved',
      filename: 'Filename',
    },
    disconnect: {
      title: 'Your uArm is not powered on',
      text: 'Please ensure: the power cable is connected;',
    },
    noSelectProject: {
      title: 'Oops...',
      text: 'You didn\'t select any project.',
    },
    deleteWarning: {
      title: 'Are you sure ?',
      text: 'You\'re going to delete project(s) forever.',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    },
    deleteCompleted: {
      title: 'Deleted',
      text: 'Your projects have been deleted.',
    },
    renameProject: {
      title: 'Rename Project',
      text: 'Please input a new project name for',
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
    },
    renameCompleted: {
      title: 'Project Renamed successful',
      text: 'New project name: ',
    },
    saveProject: {
      faila: 'You haven\'t input anything',
      failb: 'project name is taken. Please rename your Project.',
      fileNotExisted: 'project {} not existed.',
      title: 'Project Saved',
      success: 'Saved',
      newname: 'New Filename',
      inputName: 'Please input the project name',
      okBtn: 'Submit',
      cancelBtn: 'Cancel',
    },
  },
  paintApp: {
    edited: 'edited',
    tipDrawMode: 'Before drawing, please adjust the zero point to ensure the pen is TOUCHING the platform written on.' +
    ' Studio will save the last modified zero point.',
    tipLaserMode: 'Before engraving, please adjust the zero point to ensure the pen is TOUCHING the platform written on.' +
    ' Studio will save the last modified zero point.',
    titleImagePath: './assets/img/title_Drawlaser.svg',
    toolHint: {
      undo: 'Undo',
      redo: 'Forward',
      text: 'Text',
      image: 'Image',
      copy: 'Copy',
      delete: 'Delete',
      clear: 'Clear',
    },
    fontNameList: {
      blacklight: 'SimHei',
      xingkai: 'Simplified Xing Kai',
      lanting: 'Lanting Calligraphy Traditional',
      kaiti: 'Regular script traditional',
    },
    leftSide: {
      imageProject: './assets/img/Title_My Projects.svg',
      imagePatterns: './assets/img/side-patterns.svg',
    },
    dailog: {
      okBtn: 'Ok',
      cancelBtn: 'Cancel',
      onlysvg: 'Please add image format file(svg, png, jpg...)',
      empty: 'Canvas is empty.',
      quitWhilePrint: 'Please stop draw/engrave before quit.',
      deleteall: {
        msg: 'You are going to delete ALL patterns on canvas.<br>Are you sure?',
      },
      addImage: {
        option1: 'Grayscale',
        option2: 'Outline',
        option3: 'Vector',
      },
      addText: {
        title: 'Insert Text',
      },
      setting: {
        title: 'Settings',
        mode: 'Mode',
        draw: 'Write/Draw',
        laser: 'Laser',
        adjustzero: 'Adjust Zero Point',
        speed: 'Speed',
        stopButton: 'Stop',
        startButton: 'Start',
        nextButton: 'Next',
      },
      setLaser: {
        title: 'Please put the laser head on the surface of the engraved object.',
        backButton: 'Back',
      },
      installTip: {
        title: 'Hardware Installation Guide',
        subtitle: 'Before drawing/laser engraving,<br>please install the related end-effector first.',
        step1: 'Twist to remove the screw',
        step1text: 'Unplug Suction Cup',
        step2: 'Twist to fix the Holder',
        step2text: 'Plug in Universal Holder',
        step3: 'Twist to fix the Laser',
        step3b: 'Plug in the PCB board by following the arrows',
        step3text: 'Plug in Laser',
        ctg: 'Proceed to draw/engrave',
      },
    },
    sidebar: {
      project_name: 'My Project',
      picture_name: 'Insert Patterns',
    },
  },
  cura: {
    failTitle: 'Can not open CuraForuArm',
    failText: 'Can not find Cura, Do you want to download?',
    linuxTitle: 'Reminder',
    linuxText: 'Under Linux, please download and open Cura manually.',
    downloadText: 'Do you want to download?',
  },
  updateManager: {
    available: {
      title: 'New Version Available',
      message: 'New Studio version available, Would you like to download?',
    },
    notAvailable: {
      title: 'No update available',
      message: 'Version {} is the latest version.',
    },
    downloaded: {
      title: 'Download Completed',
      message: 'Download completed, would you like to install and restart?',
    },
    downloadError: {
      title: 'Download Failed',
    },
    firmwareCompleted: 'Firmware Upgrade Completed',
    firmwareUpgrading: 'Flashing new firmware to uArm, Please wait...',
  },
  about: {
    hardware: 'Hardware',
    firmware: 'Firmware',
    supportList: 'Compatible',
    versionInfo: 'Version Info',
    systemInfo: 'System Info',
    osInfo: 'OS Version',
  },
  Yes: 'Yes',
  No: 'No',
};

const self = en;
self.control = 'Control';
self.liveControl = 'Live Control';
self.off = 'OFF';
self.on = 'ON';
self.attitudeControl = 'Attitude Control';
self.positionControl = 'Position Control';
self.speedControl = 'Speed Control';
self.speed = 'Speed';
self.acceleration = 'Acceleration';
self.jointsControl = 'Joints Control';
self.positionAttitude = 'Position and Attitude Control';
self.degree = 'Degree';

self.control = {};
self.control.apply = 'Apply';
self.control.reset = 'Reset';
self.control.millimeter = 'mm';
self.control.degree = 'degree';
self.control.edit = 'Edit';

self.record = {};
self.record.control = 'Control';
self.record.speed = 'Speed';
self.record.acceleration = 'Acceleration';
self.record.jointsControl = 'Joints Control';
self.record.positionAttitude = 'Position and Attitude Control';

self.record.recording = 'Recording';
self.record.reset = 'Reset';
self.record.liveControl = 'Live Control';
self.record.off = 'OFF';
self.record.on = 'ON';
self.record.myProject = 'My Projects';
self.record.project = 'PROJECT';
self.record.edit = 'Edit';
self.record.startRecord = 'Start Recording';
self.record.finishRecord = 'Finish Recording';
self.record.pressToRecord = 'Press to record';
self.record.timer = 'Press to add timer';
self.record.saveChange = 'Save Change';
self.record.cancel = 'Cancel';
self.record.stop = 'Stop';

module.exports = en;
