import { Injectable } from '@angular/core';


interface Layer {
  group: string;
  level: string;
  url: string;
  composeTipCB: (val: object) => string;
  getShortName: (val: object) => string;
}

//let geoHost='http://51.210.249.119:8080/geoserver';
//let geoHost='http://k8s3.alia-space.com:30448/geoserver';
//let geoHost='http://k8s3.alia-space.com:30449/gs';
let geoHost='../gs';

export const layerArray: Layer[] = [{
  group: 'GADM',
  level: 'ALL',
  url: geoHost + '/gwc/service/tms/1.0.0/gadm%3Agadm@EPSG%3A3857@pbf',
  composeTipCB: compseTipGadm,
  getShortName: getShortNameGadm
},{
  group: 'GADM',
  level: '0',
  url: geoHost + '/gwc/service/tms/1.0.0/gadm%3Agadm36_0@EPSG%3A3857@pbf',
  composeTipCB: compseTipGadm,
  getShortName: getShortNameGadm
},{
  group: 'GADM',
  level: '1',
  url: geoHost + '/gwc/service/tms/1.0.0/gadm%3Agadm36_1@EPSG%3A3857@pbf',
  composeTipCB: compseTipGadm,
  getShortName: getShortNameGadm
},{
  group: 'GADM',
  level: '2',
  url: geoHost + '/gwc/service/tms/1.0.0/gadm%3Agadm36_2@EPSG%3A3857@pbf',
  composeTipCB: compseTipGadm,
  getShortName: getShortNameGadm
},{
  group: 'GADM',
  level: '3',
  url: geoHost + '/gwc/service/tms/1.0.0/gadm%3Agadm36_3@EPSG%3A3857@pbf',
  composeTipCB: compseTipGadm,
  getShortName: getShortNameGadm
},{
  group: 'GADM',
  level: '4',
  url: geoHost + '/gwc/service/tms/1.0.0/gadm%3Agadm36_4@EPSG%3A3857@pbf',
  composeTipCB: compseTipGadm,
  getShortName: getShortNameGadm
},{
  group: 'GADM',
  level: '5',
  url: geoHost + '/gwc/service/tms/1.0.0/gadm%3Agadm36_5@EPSG%3A3857@pbf',
  composeTipCB: compseTipGadm,
  getShortName: getShortNameGadm
},{
  group: 'NUTS',
  level: 'ALL',
  url: geoHost + '/gwc/service/tms/1.0.0/nuts%3ANUTS_RG_01M_2021_3857@EPSG%3A3857@pbf',
  composeTipCB: compseTipNuts,
  getShortName: getShortNameNuts
},{
  group: 'NUTS',
  level: '0',
  url: geoHost + '/gwc/service/tms/1.0.0/nuts%3ANUTS_RG_01M_2021_3857_LEVL_0@EPSG%3A3857@pbf',
  composeTipCB: compseTipNuts,
  getShortName: getShortNameNuts
},{
  group: 'NUTS',
  level: '1',
  url: geoHost + '/gwc/service/tms/1.0.0/nuts%3ANUTS_RG_01M_2021_3857_LEVL_1@EPSG%3A3857@pbf',
  composeTipCB: compseTipNuts,
  getShortName: getShortNameNuts
},{
  group: 'NUTS',
  level: '2',
  url: geoHost + '/gwc/service/tms/1.0.0/nuts%3ANUTS_RG_01M_2021_3857_LEVL_2@EPSG%3A3857@pbf',
  composeTipCB: compseTipNuts,
  getShortName: getShortNameNuts
},{
  group: 'NUTS',
  level: '3',
  url: geoHost + '/gwc/service/tms/1.0.0/nuts%3ANUTS_RG_01M_2021_3857_LEVL_3@EPSG%3A3857@pbf',
  composeTipCB: compseTipNuts,
  getShortName: getShortNameNuts
},
]


function compseTipNuts(val) {
  let res = ""
  res = 'ID: ' + val['NUTS_ID'] + '<br>' + 'Name: ' + val['NUTS_NAME'];
  //console.log('compseTipNuts result: ' + res);
  return res;
}

function compseTipGadm(val) {
  let res = "";
  if (typeof val['NAME_0'] == "string") res += 'L0: ' + val['NAME_0']; else return "";
  if (typeof val['NAME_1'] == "string") res += '<br>' + 'L1: ' + val['NAME_1']; else return res;
  if (typeof val['NAME_2'] == "string") res += '<br>' + 'L2: ' + val['NAME_2']; else return res;
  if (typeof val['NAME_3'] == "string") res += '<br>' + 'L3: ' + val['NAME_3']; else return res;
  if (typeof val['NAME_4'] == "string") res += '<br>' + 'L4: ' + val['NAME_4']; else return res;
  if (typeof val['NAME_5'] == "string") res += '<br>' + 'L5: ' + val['NAME_5']; else return res;
  //console.log('compseTipGadm result: ' + res);
  return res;
}

function getShortNameNuts(val) {
  return val['NUTS_NAME'];
}

function getShortNameGadm(val) {
  if (typeof val['NAME_5'] == "string") {
    return val['NAME_5'];
  } else if (typeof val['NAME_4'] == "string") {
    return val['NAME_4'];
  } else if (typeof val['NAME_3'] == "string") {
    return val['NAME_3'];
  } else if (typeof val['NAME_2'] == "string") {
    return val['NAME_2'];
  } else if (typeof val['NAME_1'] == "string") {
    return val['NAME_1'];
  } else if (typeof val['NAME_0'] == "string") {
    return val['NAME_0'];
  }
}

@Injectable({
  providedIn: 'root'
})

export class MapService {
  public layerGroups: {} = {};

  constructor() {
    layerArray.forEach((layer, index) => {
        if (layer.group in this.layerGroups) {
          this.layerGroups[layer.group].push(index);
        } else {
          this.layerGroups[layer.group] = [];
        }
      }
    )
  }

  public featureSelection: {};

}
