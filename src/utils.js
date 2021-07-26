const convertRange = ( value, r1, r2 ) => {
  return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
};

const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max)
}
export const getVolumeFromLinearDistance = (d,max) => {
  const converted = convertRange(d, [max,0], [0,1]);
  return clamp(converted, 0, 1);
}

const expFunction=(d,max)=>{
  return Math.exp(-d/max)
}
export const getVolumeFromExpDistance=(d,max)=>{
  const nMax = expFunction(max,max)
  const nMin = expFunction(0,max)
  const nDistance= expFunction(d,max)

  const converted = convertRange(nDistance, [nMax,nMin], [0,1]);
  return clamp(converted, 0, 1);
}
