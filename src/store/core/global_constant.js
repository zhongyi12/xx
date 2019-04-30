
const GlobalConstant = {};
const self = GlobalConstant;
window.GlobalConstant = self;

self.VERSION = { version: 'xarm7' };
self.userId = 'test';

self.COMMON_PARAMS = {
  userId: self.userId,
  version: 'xarm7',
}

// function genPublicData() {
//   return { data: self.COMMON_PARAMS };
// }

// self.INIT_CMD_PARAMS_COMMON_DATA = {
//   data: self.COMMON_PARAMS 
// };

self.INIT_CMD_PARAMS_COMMON_DATA = () => {
  return {
    data: Object.assign({}, self.COMMON_PARAMS),
  }
};

// xArm cmd
// self.CMD_ID_GET_POINT_POSE = 'xarm_get_joint_pose';
// self.CMD_ID_GET_TCP_POSE = 'xarm_get_tcp_pose';
self.CMD_ID_GET_VERSION = 'xarm_get_version';
self.CMD_ID_GET_STATE = 'xarm_get_state';

// python file cmd
self.FILE_ID_LIST_DIR = 'list_dir';
self.FILE_ID_CREATE_DIR = 'create_dir';
self.FILE_ID_CREATE_FILE = 'create_file';
self.FILE_ID_SAVE_FILE = 'save_file';
self.FILE_ID_DELETE_DIR = 'delete_dir';
self.FILE_ID_DELETE_FILE = 'delete_file';
self.FILE_ID_CHANGE_NAME = 'change_name';
self.FILE_ID_GET_FILE = 'get_file';
self.FILE_ID_GET_PROJ_FILES = 'get_project_files';

self.FILE_ID_AUTOCOMPLETE_PYTHON = 'autocomplete_python';
self.FILE_ID_RUN_PIP_COMMAND = 'run_pip_command';
self.FILE_ID_RUN_PYTHON_SCRIPT = 'run_python_script';
self.FILE_ID_STOP_PYTHON_SCRIPT = 'stop_python_script';

// paint cmd
self.PAINT_OUTLINE_PRINT = 'start_outline_printing';
self.PAINT_GREYSCALE_PRINT = 'start_grayscale_printing';
self.PAINT_STOP_PRINT = 'xarm_stop_printing';
self.PAINT_GET_ZERO_CONFIG = 'get_zeropoint_config';

self.LIST_PAINT_PROJS = 'list_paint_projects';
self.GET_PAINT_PROJECT = 'get_paint_project';
self.CREATE_PAINT_PROJ = 'create_paint_project';
self.SAVE_PAINT_PROJ = 'save_paint_project';
self.DELETE_PAINT_PROJ = 'delete_paint_project';
self.RENAME_PAINT_PROJ = 'change_paint_project_name';

self.exampleData = {"objects":[{"type":"path-group","originX":"left","originY":"top","left":350,"top":70,"width":34,"height":34,"fill":"","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":4.41,"scaleY":4.41,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"paths":[{"type":"rect","originX":"left","originY":"top","left":26,"top":56,"width":32,"height":32,"fill":"","stroke":"#000","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"evenodd","globalCompositeOperation":"source-over","transformMatrix":[1,0,0,1,-25,-55],"rx":0,"ry":0}]}],"background":"#ECEFF1"};

// record cmd
self.LIST_RECORD_PROJS = 'list_record_projects';
self.GET_RECORD_PROJECT = 'get_record_project';
self.GET_RECORD_FILE = 'get_record_file';
self.CREATE_RECORD_FILE = 'create_record_file';
self.DELETE_RECORD_FILE = 'delete_record_file';
self.CREATE_RECORD_PROJ = 'create_record_project';
self.DELETE_RECORD_PROJ = 'delete_record_project';
self.RENAME_RECORD_PROJ = 'change_record_project_name';
self.CHANGE_RECORD_FILE_NAME = 'change_record_file_name';

// app cmd
self.APPSTORE_GET_APPS = 'get_apps';
self.APPSTORE_GET_LOCAL_APPS = 'get_local_apps';
self.APPSTORE_APP_INSTALL = 'app_install';
self.APPSTORE_APP_UNINSTALL = 'app_uninstall';
self.APPSTORE_APP_REMOVE = 'app_remove';
self.APPSTORE_APP_CREATE = 'app_create';
self.APPSTORE_APP_RENAME = 'app_rename';
self.APPSTORE_APP_UPLOAD = 'app_upload';
self.APP_RUN_PYTHON = 'app_run_python_project';
self.APP_RUN_TEACH = 'start_play_recording'; // 'app_run_teach_project';
self.APP_STOP_TEACH = 'stop_play_recording';
self.APP_GET_XML = 'get_app_xml';
self.APP_GET_INSERT_XML = 'get_insert_app_xml';

self.DEBUG_SET_BEART = 'set_beart';

// setting cmd
self.SETTING_GET_LOG_INFO = 'get_log_info';
self.SETTING_CHECK_SOFTWARE_UPDATE = 'check_software_update';
self.SETTING_START_DOWNLOAD_UPDATE = 'start_download_update';
self.SETTING_START_INSTALL_UPDATE = 'start_install_update';
self.SETTING_START_INSTALL_FIRMWARE_UPDATE = 'start_update_firmware';
self.SETTING_DOWNLOAD_PROGRESS = 'download_progress';
self.SETTING_GET_DEVICE_INFO = 'get_device_info';
self.SETTING_GET_STUDIO_INFO = 'get_studio_info';

self.GET_ERROR_WARN_CODE = 'xarm_get_error_warn';
self.GET_SERVO_DEBUG_MSG = 'xarm_get_servo_debug_msg';

self.SETTING_XARM_SET_PARAMS = 'xarm_set_params';

// robot
self.MOVE_CIRCLE = 'xarm_move_circle';
self.MOVE_LINE = 'xarm_move_line';
self.MOVE_ARC_LINE = 'xarm_move_arc_line';
self.SET_MOVE_ARC_LINE = 'xarm_set_move_arc_line';
self.URGENT_STOP = 'xarm_urgent_stop';
// self.GET_JOINT_POSE = 'xarm_get_joint_pose';
self.SET_STATE = 'xarm_set_state';
self.SET_PARAMS = 'xarm_set_params';
self.MOVE_GO_HOME = 'xarm_move_gohome';
// self.GET_TCP_POSE = 'xarm_get_tcp_pose';
self.MOVE_JOINT = 'xarm_move_joint';
self.SET_SLEEP_TIME = 'xarm_sleep_cmd';
self.CLEAN_ERROR = 'xarm_clear_error';
self.CLEAN_WARN = 'xarm_clear_warn';
self.CLEAN_ERROR_WARN = 'xarm_clear_error_warn';
self.MOVE_STEP_START = 'xarm_move_step';
self.MOVE_STEP_OVER = 'xarm_move_step_over';
self.SET_SPEED_PERCENT = 'xarm_set_speed';
self.SET_INITIAL_POINT = 'xarm_set_initial_point';
self.SET_STEP_PARAM = 'xarm_set_step';
self.SET_END_TYPE = 'xarm_set_end_type';

self.SET_TCP_JERK = 'xarm_set_tcp_jerk';
self.SET_TCP_MAXACC = 'xarm_set_tcp_maxacc';
self.SET_JOINT_JERK = 'xarm_set_joint_jerk';
self.SET_JOINT_MAXACC = 'xarm_set_joint_maxacc';

self.MOTION_ENABLE = 'xarm_motion_enable';
self.SET_SERVO_DETACH = 'xarm_set_servo_detach';
self.SET_SERVO_ATTACH = 'xarm_set_servo_attach';
self.SEND_COMMAND = 'xarm_send_command';
self.SHUTDOWN = 'xarm_shutdown';
self.REBOOT = 'xarm_reboot';
self.GET_NETWORK_INFO = 'xarm_get_network';
self.SET_NETWORK_INFO = 'xarm_set_network';

self.SET_GRIPPER_ENABLE = 'xarm_set_gripper_enable';
self.SET_GRIPPER_MODE = 'xarm_set_gripper_mode';
self.GET_GRIPPER_POSITION = 'xarm_get_gripper_position';
self.SET_GRIPPER_POSITION = 'xarm_set_gripper_position';
self.set_GRIPPER_SPEED = 'xarm_set_gripper_speed';

self.SET_GPIO_DIGITAL = 'xarm_set_gpio_digital';
self.GET_GPIO_DIGITAL = 'xarm_get_gpio_digital';
self.GET_GPIO_ANALOG = 'xarm_get_gpio_analog';
self.START_REPORT_GPIO_DIGITAL = 'xarm_start_report_gpio_digital';
self.STOP_REPORT_GPIO_DIGITAL = 'xarm_stop_report_gpio_digital';

self.GET_SERVO_ADDR_16 = 'xarm_get_servo_addr_16';
self.SET_SERVO_ADDR_16 = 'xarm_set_servo_addr_16';
self.GET_SERVO_ADDR_32 = 'xarm_get_servo_addr_32';
self.SET_SERVO_ADDR_32 = 'xarm_set_servo_addr_32';
self.CLEAN_SERVO_ERROR = 'xarm_clean_servo_error';

self.SET_GRAVITY_DIRECTION = 'xarm_set_gravity_direction';
self.SET_TCP_LOAD = 'xarm_set_tcp_load';
self.SET_COLLISION_SENSITIVITY = 'xarm_set_collision_sensitivity';
self.SET_TEACH_SENSITIVITY = 'xarm_set_teach_sensitivity';
self.SWITCH_MODE = 'xarm_switch_mode';
self.SET_TCP_OFFSET = 'xarm_set_tcp_offset';
self.SAVE_CONFIG = 'xarm_save_config';
self.CLEAN_CONFIG = 'xarm_delete_config';

self.userId = 'test';

self.IDE_LIST_PROJECTS = 'ide_list_projects';
self.IDE_GET_PROJECT = 'ide_get_project';
self.IDE_CREATE_PROJECT = 'ide_create_project';
self.IDE_DEL_PROJECT = 'ide_delete_project';
self.IDE_RENAME_PROJECT = 'ide_rename_project';
self.IDE_SAVE_PROJECT = 'ide_save_project';
self.IDE_CREATE_FILE = 'ide_create_file';
self.IDE_WRITE_FILE = 'ide_write_file';
self.IDE_GET_FILE = 'ide_get_file';
self.IDE_DEL_FILE = 'ide_delete_file';
self.IDE_RENAME_FILE = 'ide_rename_file';
self.IDE_CREATE_FOLDER = 'ide_create_folder';
self.IDE_DEL_FOLDER = 'ide_delete_folder';
self.IDE_RENAME_FOLDER = 'ide_rename_folder';
self.IDE_GET_CONFIG = 'get_ide_config';
self.BLOCKLY_TO_PYTHON = 'ide_blockly_to_python';

self.AUTOCOMPLETE_PYTHON = 'autocomplete_python';
self.RUN_PIP_COMMAND = 'run_pip_command';
self.RUN_PYTHON_PROGRAM = 'run_python_program';
self.STOP_PYTHON_PROGRAM = 'stop_python_program';

self.CONVERT_BLOCKLY_TO_PYTHON = 'convert_blockly_to_python';

export default self;
