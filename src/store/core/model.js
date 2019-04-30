
import LocalTeach from './model_local_teach';
import localProjTree from './model_local_proj_tree';
import LocalAppsMgr from './model_local_apps_mgr';
import localPaintMgr from './model_local_paint_mgr';
import localSettingMgr from './model_local_setting_mgr';
import localProfileMgr from './model_local_Profile_mgr';
import commonStatusMgr from './model_common_status_mgr';
import Robot from './model_local_robot';
import language_manage from './language_manage';
import IdeModel from './model_ide';
import UtilModel from './model_util';
import ExceptionModel from './model_exception';

const Model = {};
Model.localTeach = LocalTeach;
Model.localProjTree = localProjTree;
Model.localAppsMgr = LocalAppsMgr;
Model.localPaintMgr = localPaintMgr;
Model.commonStatusMgr = commonStatusMgr;
Model.robot = Robot;
Model.localSettingMgr = localSettingMgr;
Model.localProfileMgr = localProfileMgr;
Model.language_manage = language_manage;
Model.ideModel = IdeModel;
Model.utilModel = UtilModel;
Model.exceptionModel = ExceptionModel;

console.log('test order model')

export default Model;
