import {
  inv,
  matrix,
  multiply,
  transpose,
  norm,
  add,
  atan2,
  sin,
  cos,
  divide,
  MathType
} from 'mathjs';
import { Georeferenzierung, Georeferenzierungspunkt, GK2PxMatrix } from 'src/models/v1';


interface PointGK {
  gk_rechts: number, gk_hoch: number
}

interface PointPx { px_x: number, px_y: number }

export function px_2_gk(args: PointPx, georef: Georeferenzierung) {

  const r = add(multiply([[georef.x01, georef.x02], [georef.x11, georef.x12]], [[args.px_x], [args.px_y]]), [[georef.x00], [georef.x10]])
  console.log(r)

  return {
    gk_rechts: r[0][0],
    gk_hoch: r[1][0]
  } as PointGK
}

export function get_gk_2_px_matrix(georef: Georeferenzierung) {
  const args = { gk_rechts: 0, gk_hoch: 0 }
  const step1 = add([[args.gk_rechts], [args.gk_hoch]], [[-georef.x00], [-georef.x10]])

  const step2 = inv([[georef.x01, georef.x02], [georef.x11, georef.x12]])

  return { translation: step1, matrix: step2 } as GK2PxMatrix

}

export function gk_2_px(args: { gk_rechts: number, gk_hoch: number }, inverter: GK2PxMatrix) {
  const step1 = add([[args.gk_rechts], [args.gk_hoch]], inverter.translation)

  const step2 = multiply(inverter.matrix, step1)

  return {
    px_x: step2[0][0],
    px_y: step2[1][0]
  } as PointPx

}

export function georeferenzieren(pointsOnMap: Georeferenzierungspunkt[], image: HTMLElement) {
  if (pointsOnMap.length <= 2) {
    throw new Error('You need at least 3 points')
  }
  console.log('create a matrix');
  const myLeastsquareArr = [];
  const myGkHochArr = [];
  const myGkRechtsArr = [];
  for (const el of pointsOnMap) {
    myLeastsquareArr.push([1, el.pixel_x, el.pixel_y]);
    myGkHochArr.push(el.gk_hoch);
    myGkRechtsArr.push(el.gk_rechts);
  }
  const myLeastsquareMatrix = matrix(myLeastsquareArr);
  const myGkHochVec = matrix(myGkHochArr);
  const myGkRechtsVec = matrix(myGkRechtsArr);

  console.log(myLeastsquareMatrix, myGkHochVec, myGkRechtsVec);

  const minizmizer = multiply(
    inv(multiply(transpose(myLeastsquareArr), myLeastsquareArr)),
    transpose(myLeastsquareArr)
  );
  console.log(minizmizer);
  console.log();
  const xWert = multiply(minizmizer, myGkRechtsVec);
  const yWert = multiply(minizmizer, myGkHochVec);
  const pixel_2_gk: number[][] = [[], []];
  xWert.toString();

  xWert.forEach(function (value, index) {
    console.log('value:', value, 'index:', index);
    pixel_2_gk[0].push(value);
  });
  yWert.forEach(function (value, index) {
    console.log('value:', value, 'index:', index);
    pixel_2_gk[1].push(value);
  });


  const a = image.clientHeight;
  const b = image.clientWidth;

  const upper_left_arr = multiply(pixel_2_gk, [[1], [0], [0]]);
  const upper_right_arr = multiply(pixel_2_gk, [[1], [0], [a]]);
  const lower_right_arr = multiply(pixel_2_gk, [[1], [b], [a]]);
  const lower_left_arr = multiply(pixel_2_gk, [[1], [b], [0]]);

  console.log(xWert);
  console.log('myResult', pixel_2_gk);




  const georef_data_backend = {
    x00: pixel_2_gk[0][0],
    x01: pixel_2_gk[0][1],
    x02: pixel_2_gk[0][2],
    x10: pixel_2_gk[1][0],
    x11: pixel_2_gk[1][1],
    x12: pixel_2_gk[1][2],
    upper_left: {
      gk_rechts: upper_left_arr[0][0],
      gk_hoch: upper_left_arr[1][0],
    },
    upper_right: {
      gk_rechts: upper_right_arr[0][0],
      gk_hoch: upper_right_arr[1][0],
    },
    lower_right: {
      gk_rechts: lower_right_arr[0][0],
      gk_hoch: lower_right_arr[1][0],
    },
    lower_left: {
      gk_rechts: lower_left_arr[0][0],
      gk_hoch: lower_left_arr[1][0],
    },
  };
  console.log(georef_data_backend)

  return georef_data_backend;
}

export function compute2PointGeoref(pointsOnMap: Georeferenzierungspunkt[], image: HTMLElement) {
  if (pointsOnMap.length != 2) {
    throw new Error('You need exactly 2 points')
  }
  const p_x_a = pointsOnMap[0].pixel_x;
  const p_y_a = pointsOnMap[0].pixel_y;

  const p_gk_rechts_a = pointsOnMap[0].gk_rechts;
  const p_gk_hoch_a = pointsOnMap[0].gk_hoch;

  const p_x_b = pointsOnMap[1].pixel_x;
  const p_y_b = pointsOnMap[1].pixel_y;

  const p_gk_rechts_b = pointsOnMap[1].gk_rechts;
  const p_gk_hoch_b = pointsOnMap[1].gk_hoch;
  const v_gk = [p_gk_rechts_b - p_gk_rechts_a, p_gk_hoch_b - p_gk_hoch_a];
  const v_px = [p_x_b - p_x_a, p_y_b - p_y_a];

  console.log((atan2(v_gk[0], v_gk[1]) / (2 * Math.PI)) * 360);
  console.log((atan2(v_px[0], v_px[1]) / (2 * Math.PI)) * 360);

  // console.log((atan2(10, 10) / (2 * Math.PI)) * 360);
  const theta = atan2(v_px[0], v_px[1]) - atan2(v_gk[0], v_gk[1]);

  console.log((theta / (2 * Math.PI)) * 360, theta);

  const rotation_matrx = [
    [cos(theta), -sin(theta)],
    [sin(theta), cos(theta)],
  ];
  console.log('rotation_matrx', rotation_matrx);

  console.log(multiply(rotation_matrx, [[1], [0]]));

  console.log(v_gk, v_px);
  // console.log(norm(v_gk, 2));
  // console.log(norm(v_px, 2));
  const gk_vec_laenge = norm(v_gk, 2)
  const px_vec_laenge = norm(v_px, 2)
  const scaling = divide(gk_vec_laenge, px_vec_laenge);

  const scaling_rotation: any = multiply(rotation_matrx, scaling);

  console.log('assert == v_gk', scaling_rotation);

  const a_gk = [[p_gk_rechts_a], [p_gk_hoch_a]];
  const a_px = [[p_x_a], [p_y_a]];

  console.log(
    'Spiegelung:',
    multiply(scaling_rotation, multiply(-1, a_px))
  );

  const translation: any = add(
    a_gk,
    multiply(scaling_rotation, multiply(-1, a_px))
  );
  console.log(translation);

  console.log(scaling_rotation);

  const current_px_2_gk_transform = [
    [translation[0][0], scaling_rotation[0][0], scaling_rotation[0][1]],
    [translation[1][0], scaling_rotation[1][0], scaling_rotation[1][1]],
  ];

  console.log(current_px_2_gk_transform);

  console.log(add(multiply(scaling_rotation, [[53], [105]]), translation));
  console.log(
    add(multiply(scaling_rotation, [[1048], [420]]), translation)
  );

  const pixel_2_gk = current_px_2_gk_transform
  const a = image.clientHeight;
  const b = image.clientWidth;

  const upper_left_arr = multiply(pixel_2_gk, [[1], [0], [0]]);
  const upper_right_arr = multiply(pixel_2_gk, [[1], [0], [a]]);
  const lower_right_arr = multiply(pixel_2_gk, [[1], [b], [a]]);
  const lower_left_arr = multiply(pixel_2_gk, [[1], [b], [0]]);

  const georef_data_backend = {
    x00: pixel_2_gk[0][0],
    x01: pixel_2_gk[0][1],
    x02: pixel_2_gk[0][2],
    x10: pixel_2_gk[1][0],
    x11: pixel_2_gk[1][1],
    x12: pixel_2_gk[1][2],
    upper_left: {
      gk_rechts: upper_left_arr[0][0],
      gk_hoch: upper_left_arr[1][0],
    },
    upper_right: {
      gk_rechts: upper_right_arr[0][0],
      gk_hoch: upper_right_arr[1][0],
    },
    lower_right: {
      gk_rechts: lower_right_arr[0][0],
      gk_hoch: lower_right_arr[1][0],
    },
    lower_left: {
      gk_rechts: lower_left_arr[0][0],
      gk_hoch: lower_left_arr[1][0],
    },
  };

  return georef_data_backend
}
