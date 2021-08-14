import {Component, OnInit, ChangeDetectionStrategy, Input, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View'
import * as olProj from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import VectorTile from 'ol/layer/VectorTile';
import { VectorTile as VectorTileSource } from 'ol/source';
import {createXYZ} from 'ol/tilegrid';
import Style from 'ol/style/Style';
import Feature from 'ol/Feature'
import { Fill, Stroke, Text, Circle } from 'ol/style';
import * as condition from  'ol/events/condition';
import {GML, GeoJSON} from "ol/format";
import {bbox as bboxStrategy} from 'ol/loadingstrategy';
//import {tile as tileStrategy} from 'ol/loadingstrategy';
//import {bbox} from "ol/loadingstrategy";
import { SideNavService } from '../../services/side-nav.service';
import GML3 from "ol/format/GML3";
import MVT from "ol/format/MVT";
import {Select} from "ol/interaction";
import {Overlay} from "ol";

class SelectableVectorTileLayer {
  vectorTileLayer: VectorTile<any>;
  selectionLayer: VectorTile<any>;
  vectorTileSource: VectorTileSource<any>;
  selection: {};

  constructor(private map: Map, private url: string) {
    this.selection = {};

    this.vectorTileSource = new VectorTileSource({
      tilePixelRatio: 1, // oversampling when > 1
      tileGrid: createXYZ({maxZoom: 19}),
      format: new MVT({featureClass: Feature}),
      url: url +
        '/{z}/{x}/{-y}.pbf'
    })

    this.vectorTileLayer = new VectorTile({

      style: new Style({
        stroke: new Stroke({
          color: 'rgba(0, 255, 0, 1.0)',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),

      source: this.vectorTileSource
    });

    this.selectionLayer = new VectorTile({
      map: this.map,
      renderMode: 'vector',
      source: this.vectorTileLayer.getSource(),
      style: (feature) => {
        if (feature.getId() in this.selection) {
          return new Style({
            stroke: new Stroke({
              color: 'rgba(200,20,20,0.8)',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(200,20,20,0.4)',
            }),
          });
        }
      },
    });
    this.map.addLayer(this.vectorTileLayer);
    this.hide();
  }

  clearSelection(){
    this.selection = {};
    this.selectionLayer.changed();
  }

  selectEvent(event) {
    this.vectorTileLayer.getFeatures(event.pixel).then((features) => {
      if (!features.length) {
        this.selection = {};
        this.selectionLayer.changed();
        return;
      }
      const feature = features[0];
      if (!feature) {
        return;
      }
      const fid = feature.getId();

      if (condition.shiftKeyOnly(event) !== true && condition.platformModifierKeyOnly(event) !== true) {
        this.selection = {};
      }
      // add selected feature to lookup
      this.selection[fid] = feature;

      this.selectionLayer.changed();
    });
  }

  hide(){
    this.vectorTileLayer.setVisible(false);
    this.selectionLayer.setVisible(false);
  }

  show(){
    this.vectorTileLayer.setVisible(true);
    this.selectionLayer.setVisible(true);
  }
}

@Component({
  selector: 'app-map',
  //template: '',
  //template: './map.component.html',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  styles: [':host { width: 100%; height: 100%; display: block; }',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() map: Map;
  wfsLayerGadm: VectorLayer<any>;
  private popupOverlay: Overlay;
  @ViewChild('popup') popup: ElementRef;
  vectorTileLayerGadm: VectorTile<any>;
  selectionLayerGadm: VectorTile<any>;
  vectorTileSourceGadm: VectorTileSource<any>;

  vectorLayers: {};

  selectedLayer: string;



  constructor(private elementRef: ElementRef, private sideNavService: SideNavService) {
  }
  setLayer(layer: string) {
    console.log("Layer chaged on map: " + layer);
    this.vectorLayers[this.selectedLayer].hide();
    this.vectorLayers[this.selectedLayer].clearSelection();
    this.selectedLayer = layer;
    this.vectorLayers[this.selectedLayer].show();
  }


  ngOnInit() {

    this.vectorLayers = {};
    this.selectedLayer = 'gadm_all';

    this.vectorLayers['gadm_all'] = new SelectableVectorTileLayer(this.map,
      'http://51.210.249.119:8080/geoserver/gwc/service/tms/1.0.0/gadm%3Agadm@EPSG%3A3857@pbf');
    this.vectorLayers['gadm_0'] = new SelectableVectorTileLayer(this.map,
      'http://51.210.249.119:8080/geoserver/gwc/service/tms/1.0.0/gadm%3Agadm36_0@EPSG%3A3857@pbf');
    this.vectorLayers['gadm_1'] = new SelectableVectorTileLayer(this.map,
      'http://51.210.249.119:8080/geoserver/gwc/service/tms/1.0.0/gadm%3Agadm36_1@EPSG%3A3857@pbf');
    this.vectorLayers['gadm_2'] = new SelectableVectorTileLayer(this.map,
      'http://51.210.249.119:8080/geoserver/gwc/service/tms/1.0.0/gadm%3Agadm36_2@EPSG%3A3857@pbf');
    this.vectorLayers['gadm_3'] = new SelectableVectorTileLayer(this.map,
      'http://51.210.249.119:8080/geoserver/gwc/service/tms/1.0.0/gadm%3Agadm36_3@EPSG%3A3857@pbf');
    this.vectorLayers['gadm_4'] = new SelectableVectorTileLayer(this.map,
      'http://51.210.249.119:8080/geoserver/gwc/service/tms/1.0.0/gadm%3Agadm36_4@EPSG%3A3857@pbf');
    this.vectorLayers['gadm_5'] = new SelectableVectorTileLayer(this.map,
      'http://51.210.249.119:8080/geoserver/gwc/service/tms/1.0.0/gadm%3Agadm36_5@EPSG%3A3857@pbf');
    this.vectorLayers['nuts_rg'] = new SelectableVectorTileLayer(this.map,
      'http://51.210.249.119:8080/geoserver/gwc/service/tms/1.0.0/nuts%3ANUTS_RG_01M_2021_3857@EPSG%3A3857@pbf');
    this.vectorLayers['nuts_0'] = new SelectableVectorTileLayer(this.map,
      'http://51.210.249.119:8080/geoserver/gwc/service/tms/1.0.0/nuts%3ANUTS_RG_01M_2021_3857_LEVL_0@EPSG%3A3857@pbf');
    this.vectorLayers['nuts_1'] = new SelectableVectorTileLayer(this.map,
      'http://51.210.249.119:8080/geoserver/gwc/service/tms/1.0.0/nuts%3ANUTS_RG_01M_2021_3857_LEVL_1@EPSG%3A3857@pbf');
    this.vectorLayers['nuts_2'] = new SelectableVectorTileLayer(this.map,
      'http://51.210.249.119:8080/geoserver/gwc/service/tms/1.0.0/nuts%3ANUTS_RG_01M_2021_3857_LEVL_2@EPSG%3A3857@pbf');
    this.vectorLayers['nuts_3'] = new SelectableVectorTileLayer(this.map,
      'http://51.210.249.119:8080/geoserver/gwc/service/tms/1.0.0/nuts%3ANUTS_RG_01M_2021_3857_LEVL_3@EPSG%3A3857@pbf');

    this.vectorLayers[this.selectedLayer].show();

    this.map.IMAGE_RELOAD_ATTEMPTS = 3;
    this.map.setTarget(this.elementRef.nativeElement);
    this.map.setView(new View({
      center: olProj.fromLonLat([12.4659589, 41.9101776]),//[146, -42]),
      zoom: 10
    }))

    this.map.getView().on('change:resolution', function() {
      //TODO change layer level by actual map resolution
      //console.log("this.view.getResolution() = " + this.getResolution());
      //console.log("resolution" + resolution);
      /*
      if (this.getResolution() > 200) {
        this.map.getLayers().getArray()
          .filter(layer => layer.get('name') === 'Marker')
          .forEach(layer => map.removeLayer(layer));
      };
      */
    });

    const vectorSource = new VectorSource({
      format: new GML3(),
      url: function (extent, resolution) {

        //if (resolution > 200) return undefined;
        return (
          'http://51.210.249.119:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&outputFormat=gml3' +
          '&bbox=' +
          extent.join(',') +
          '&srsName=EPSG:3857&typeName=gadm'
        );
      },
      strategy: bboxStrategy,
    });

    this.wfsLayerGadm = new VectorLayer({
      source: vectorSource,
      //name: 'gadm_1_1',
      maxResolution: 200,
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(0, 0, 255, 1.0)',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.1)',
        }),
      })
    });


    this.map.on(['click'], (event) => {

      this.vectorLayers[this.selectedLayer].selectEvent(event);

    });

  };

  getSelected() {
    console.log("features: " + Object.keys(this.vectorLayers[this.selectedLayer].selection).length);
    return this.vectorLayers[this.selectedLayer].selection;
  }

  compseNames(val) {
    let res = ""
    if (this.selectedLayer.includes('gadm')) {
      if (typeof val['NAME_0'] == "string") res += 'L0: ' + val['NAME_0']; else return "";
      if (typeof val['NAME_1'] == "string") res += '<br>' + 'L1: ' + val['NAME_1']; else return res;
      if (typeof val['NAME_2'] == "string") res += '<br>' + 'L2: ' + val['NAME_2']; else return res;
      if (typeof val['NAME_3'] == "string") res += '<br>' + 'L3: ' + val['NAME_3']; else return res;
      if (typeof val['NAME_4'] == "string") res += '<br>' + 'L4: ' + val['NAME_4']; else return res;
      if (typeof val['NAME_5'] == "string") res += '<br>' + 'L5: ' + val['NAME_5']; else return res;
    } else if (this.selectedLayer.includes('nuts')) {
      res = 'ID: ' + val['NUTS_ID'] + '<br>' + 'Name: ' + val['NUTS_NAME'];
    }
    return res;
  }

  ngAfterViewInit(): void {
    this.sideNavService.setMap(this);

    this.popupOverlay = new Overlay({
      element: this.popup.nativeElement,
      offset: [9, 9]
    });
    this.map.addOverlay(this.popupOverlay);

    this.map.on('pointermove', (event) => {
      //console.log(event)
      let features = [];

      this.map.forEachFeatureAtPixel(event.pixel,
         (feature, layer) => {

          features.push(feature);




          const valuesToShow = [];
          if (features && features.length > 0) {
            features.forEach( clusterFeature => {
             valuesToShow.push(clusterFeature.getProperties());
            });

            if (valuesToShow.length == 1) {
              this.popup.nativeElement.innerHTML = this.compseNames(valuesToShow[0]) ;
            }
            //FIXME!! add table gen for multiple features

            this.popup.nativeElement.hidden = false;
            this.popupOverlay.setPosition(event.coordinate);
          }
        },
        { layerFilter: (layer) => {
            {
              //console.log((typeof layer === typeof new VectorLayer()) ? true : false)
              return (typeof layer === typeof new VectorLayer()) ? true : false;
            }
          }, hitTolerance: 0 }
      );

      if (!features || features.length === 0) {
        this.popup.nativeElement.innerHTML = '';
        this.popup.nativeElement.hidden = true;
      }
    });
    this.map.updateSize();
  }
}
