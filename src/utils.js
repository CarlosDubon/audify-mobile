const convertRange = ( value, r1, r2 ) => {
  return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
};

const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

const expFunction = (d,max)=>{
  return Math.exp(-d / max);
};

/**
 * @param tetha user compass reference (North)
 * @param alpha user to place angle reference (North)
 */
const rotateRefAngle = (tetha, alpha) => {
  const beta = alpha - tetha;
  return beta;
};

const degreesToRadians = (degrees)=>
{
  const pi = Math.PI;
  return degrees * (pi / 180);
};

const radiansToDegrees = (radians) => {
  const pi = Math.PI;
  return radians * ( 180 / pi );
};

export const getEarthAngleFromArc = (distance) => {
  const EarthRadius = 6371 * 1000;

  //Arc = R * theta -> theta = Arc / R -> Radians
  const theta = distance / EarthRadius;
  return radiansToDegrees(theta);
};

export const getGeoVelocityComponents = (distance, time, theta) => {
  const alpha = degreesToRadians(theta);
  const velocity = distance / time;
  const vx = velocity * Math.sin(alpha);
  const vy = velocity * Math.cos(alpha);

  return {
    v: velocity,
    vx: vx,
    vy: vy,
  };
};

export const getNewPosition = ({ latitude, longitude }, { vx, vy }, t) => {
  return {
    latitude: latitude + (vy * t),
    longitude: longitude + (vx * t),
  };
};

export const getBalanceFromAngles = (mCompassHeading, placeHeading) => {
  const placeRotatedAngle = degreesToRadians(
    rotateRefAngle(mCompassHeading, placeHeading)
  );

  return Math.sin(placeRotatedAngle);
};

export const getVolumeFromLinearDistance = (d,max) => {
  const converted = convertRange(d, [max,0], [0,1]);
  return clamp(converted, 0, 1);
};

export const getVolumeFromExpDistance = (d,max)=>{
  const nMax = expFunction(max,max);
  const nMin = expFunction(0,max);
  const nDistance = expFunction(d,max);

  const converted = convertRange(nDistance, [nMax,nMin], [0,1]);
  return clamp(converted, 0, 1);
};
