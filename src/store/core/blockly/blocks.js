const blocks = [];

import motion_sleep from './blocks/motion_sleep';
blocks.push(motion_sleep);

import motion_move_7 from './blocks/motion_move_7';
blocks.push(motion_move_7);

import motion_move_to from './blocks/motion_move_to';
blocks.push(motion_move_to);

import motion_move_arc_to from './blocks/motion_move_arc_to';
blocks.push(motion_move_arc_to);

import motion_move from './blocks/motion_move';
blocks.push(motion_move);

import motion_position7 from './blocks/motion_position7';
blocks.push(motion_position7);

import motion_position from './blocks/motion_position';
blocks.push(motion_position);

import motion_position_r from './blocks/motion_position_r';
blocks.push(motion_position_r);

import motion_set_speed from './blocks/motion_set_speed';
blocks.push(motion_set_speed);

import motion_set_acceleration from './blocks/motion_set_acceleration';
blocks.push(motion_set_acceleration);

import motion_set_angle_speed from './blocks/motion_set_angle_speed';
blocks.push(motion_set_angle_speed);

import motion_set_angle_acceleration from './blocks/motion_set_angle_acceleration';
blocks.push(motion_set_angle_acceleration);

import motion_reset from './blocks/motion_reset';
blocks.push(motion_reset);

import motion_stop from './blocks/motion_stop';
blocks.push(motion_stop);

import logic_wait_until from './blocks/logic_wait_until';
blocks.push(logic_wait_until);

import logic_wait from './blocks/logic_wait';
blocks.push(logic_wait);

import loop_break from './blocks/loop_break';
blocks.push(loop_break);

import loop_run_forever from './blocks/loop_run_forever';
blocks.push(loop_run_forever);

import app_studio_run_file from './blocks/app_studio_run_file';
blocks.push(app_studio_run_file);

import app_studio_run_python from './blocks/app_studio_run_python';
blocks.push(app_studio_run_python);

import app_studio_play_recording from './blocks/app_studio_play_recording';
blocks.push(app_studio_play_recording);

import app_studio_copy_recording from './blocks/app_studio_copy_recording';
blocks.push(app_studio_copy_recording);

import app_studio_run_app from './blocks/app_studio_run_app';
blocks.push(app_studio_run_app);

import event_condition_key_pressed from './blocks/event_condition_key_pressed';
blocks.push(event_condition_key_pressed);

import event_keypressed from './blocks/event_keypressed';
blocks.push(event_keypressed);

import event_keypressed_stop from './blocks/event_keypressed_stop';
blocks.push(event_keypressed_stop);

import gripper_enable from './blocks/gripper_enable';
blocks.push(gripper_enable);

import gripper_speed from './blocks/gripper_speed';
blocks.push(gripper_speed);

import gripper_position from './blocks/gripper_position';
blocks.push(gripper_position);

import gripper_mode from './blocks/gripper_mode';
blocks.push(gripper_mode);

import gripper_set from './blocks/gripper_set';
blocks.push(gripper_set);

import btn_set from './blocks/btn_set';
blocks.push(btn_set);

import btn_upload from './blocks/btn_upload';
blocks.push(btn_upload);

import tool_remark from './blocks/tool_remark';
blocks.push(tool_remark);

import tool_comment from './blocks/tool_comment';
blocks.push(tool_comment);

import tool_message from './blocks/tool_message';
blocks.push(tool_message);

import set_collision_sensitivity from './blocks/set_collision_sensitivity';
blocks.push(set_collision_sensitivity);

import set_teach_sensitivity from './blocks/set_teach_sensitivity';
blocks.push(set_teach_sensitivity);

import set_tcp_load from './blocks/set_tcp_load';
blocks.push(set_tcp_load);

import set_tcp_offset from './blocks/set_tcp_offset';
blocks.push(set_tcp_offset);

import save_config from './blocks/save_config';
blocks.push(save_config);

import restore_default_config from './blocks/restore_default_config';
blocks.push(restore_default_config);

import gpio_set_digital from './blocks/gpio_set_digital';
blocks.push(gpio_set_digital);

import gpio_get_digital from './blocks/gpio_get_digital';
blocks.push(gpio_get_digital);

import gpio_get_analog from './blocks/gpio_get_analog';
blocks.push(gpio_get_analog);

import event_gpio_digital from './blocks/event_gpio_digital';
blocks.push(event_gpio_digital);

import set_gravity_direction from './blocks/set_gravity_direction';
blocks.push(set_gravity_direction);

import motion_position_c from './blocks/motion_position_c';
blocks.push(motion_position_c);

// import move_circle from './blocks/motion_move_circle';
// blocks.push(move_circle);

import btn_move from './blocks/btn_move';
blocks.push(btn_move);

import btn_edit from './blocks/btn_edit';
blocks.push(btn_edit);

import move_joints from './blocks/move_joints';
blocks.push(move_joints);

import move_cartesian from './blocks/move_cartesian';
blocks.push(move_cartesian);

import move_circle from './blocks/move_circle';
blocks.push(move_circle);

export default { blocks: blocks };
