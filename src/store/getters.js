export const localJoints = (state) => {
  // const arr = state.robot.info.axis;
  // console.log('robot', state.robot);
  // const ANGLE_DIFF = [45.77, 0, 9.15, 85.42, 1.53, -91.53];
  const arr = state.robot.local.joints;
  if (arr && (arr.length > 0)) {
    const values = arr.map(str => Number(str));
    // console.log('arr posi print:', values.length);
    // console.log('ANGLE_DIFF:', ANGLE_DIFF);
    // console.table(values);
    this.test = values[1];
    return values;
  }
  return [0, 0, 0, 0, 0, 0, 0];
};

export const remoteJoints = (state) => {
  const arr = state.robot.remote.joints;
  if (arr && (arr.length > 0)) {
    const values = arr.map(str => Number(str));
    return values;
  }
  return [0, 0, 0, 0, 0, 0, 0];
};

export const end = state => ({
  position: state.robot.local.position,
  orientation: state.robot.local.orientation,
});

export const geometry = (state) => {
  const func = (type, index) => {
    const gm = state.geometry[type][index]
    return gm
  }
  return func
}
