import {Component, OnInit, ChangeDetectionStrategy, Input, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View'
import * as olProj from 'ol/proj';
//import VectorLayer from 'ol/layer/Vector';
import {Vector as VectorLayer} from 'ol/layer';
import {Vector} from 'ol/source';
// import VectorSource from 'ol/source/Vector';
import VectorTile from 'ol/layer/VectorTile';
import { VectorTile as VectorTileSource } from 'ol/source';
import {createXYZ} from 'ol/tilegrid';
import Style from 'ol/style/Style';
import Feature from 'ol/Feature'
import { Fill, Stroke, Text, Circle } from 'ol/style';
// import * as condition from  'ol/events/condition';
// import {GML, GeoJSON} from "ol/format";
// import {bbox as bboxStrategy} from 'ol/loadingstrategy';
//import {tile as tileStrategy} from 'ol/loadingstrategy';
//import {bbox} from "ol/loadingstrategy";
import { SideNavService } from '../../services/side-nav.service';
// import GML3 from "ol/format/GML3";
import MVT from "ol/format/MVT";
// import {Select} from "ol/interaction";
import {Overlay} from "ol";
import * as olExtent from 'ol/extent';
import {layerArray, MapService} from "../../services/map.service";

import {Polygon} from "ol/geom"

class SelectableVectorTileLayer {
  vectorTileLayer: VectorTile<any>;
  selectionLayer: VectorTile<any>;
  vectorTileSource: VectorTileSource<any>;
  selection: {};

  constructor(private map: Map, private comp: any, private layerID: number, private layerName: string, private globalSelection: {},
              private url: string, private composeTipCB: (val: object) => string,
              private getShortNome: (val: object) => string) {

    this.selection = globalSelection;

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
        let currFeatureID = this.layerID + '-' + feature.getId();
        if ( currFeatureID in this.selection) {
          /* global preview layer???
          this.selectionSourceGlobal.addFeatures([feature.clone()]);
          this.selectionSourceGlobal.changed();
          */
          if (currFeatureID === comp.highlighted) {
            return new Style({
              stroke: new Stroke({
                color: 'rgba(20,20,200,0.8)',
                width: 2,
              }),
              fill: new Fill({
                color: 'rgba(20,20,200,0.4)',
              }),
            });
          } else {
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
        }
      },
    });
    this.map.addLayer(this.vectorTileLayer);
    this.hide();
  }
/*
  clearSelection(){
    this.selection = {};
    this.selectionLayer.changed();
  }
*/
  composeTip(val) {
    return this.composeTipCB(val);
  }

  selectEvent(event) {
    this.comp.highlighted = "";
    this.vectorTileLayer.getFeatures(event.pixel).then((features) => {

      const feature = features[0];
      if (!feature) {
        return;
      }

      const fid = feature.getId();
      feature['layerID'] = this.layerID;
      feature['layerName'] = this.layerName;
      feature['shortName'] = this.getShortNome(feature.getProperties());
      feature['selectedAtZoom'] = this.map.getView().getZoom();

      if (this.layerID + '-' + fid in this.selection) {
        console.log("fid to be removed: " + fid);
        delete this.selection[this.layerID + '-' + fid];
        this.selectionLayer.changed();

      } else {

        this.selection[this.layerID + '-' + fid] = feature;
        this.selectionLayer.changed();

      }

    });
  }

  showSelection(){
    this.selectionLayer.setVisible(true);
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
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  styles: [':host { width: 100%; height: 100%; display: block; }',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() map: Map;
  private popupOverlay: Overlay;
  @ViewChild('popup') popup: ElementRef;
  /* global preview layer???
  selectionSourceGlobal: VectorTileSource<any>;
  selectionLayerGlobal: VectorTile<any>;
   */
  doSpin: boolean = false;

  vectorLayers: {};

  selectedLayer: number;
  globalSelection: {};

  highlighted: string;



  constructor(private elementRef: ElementRef, private sideNavService: SideNavService, private mapService: MapService) {
  }

  setLayer(layer: number) {
    console.log("Layer chaged on map: " + layer);
    this.vectorLayers[this.selectedLayer].hide();
    //this.vectorLayers[this.selectedLayer].clearSelection();
    this.selectedLayer = layer;
    this.vectorLayers[this.selectedLayer].show();
  }

  removeZone(zone: string){
    delete this.globalSelection[zone];
    this.vectorLayers[this.selectedLayer].selectionLayer.changed();
  }

  ngOnInit() {

    this.vectorLayers = {};
    this.mapService.featureSelection = {};
    this.globalSelection = this.mapService.featureSelection;
    this.selectedLayer = 0;
    this.highlighted = "";

    /* global preview layer???
    this.selectionSourceGlobal = new Vector({
    });

    this.selectionLayerGlobal = new VectorLayer({
      source: this.selectionSourceGlobal,
      style: new Style({
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.3)',
        }),
        stroke: new Stroke({
          color: '#33ccff00',
          width: 2,
        })
      })
    });
    */
    layerArray.forEach( (layer,index) => {
      this.vectorLayers[index] = new SelectableVectorTileLayer(this.map, this ,index,
        layer.group + "_" + layer.level, this.globalSelection, layer.url,
        layer.composeTipCB, layer.getShortName);
      }
    )
    /* global preview layer???
    this.map.addLayer(this.selectionLayerGlobal);
    */

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

    this.map.on(['click'], (event) => {

      this.vectorLayers[this.selectedLayer].selectEvent(event);

    });

  };

  showAllSelection() {
    /* global preview layer???
    for (let vectorLayersKey in this.vectorLayers) {
      this.vectorLayers[vectorLayersKey].hide();
      this.selectionLayerGlobal.setVisible(true);
      //this.vectorLayers[vectorLayersKey].showSelection();
    }
   */
  }


  getSelected() {
    console.log("features: " + Object.keys(this.vectorLayers[this.selectedLayer].selection).length);
    return this.vectorLayers[this.selectedLayer].selection;
  }

  compseNames(val) {
    return this.vectorLayers[this.selectedLayer].composeTip(val);
  }

  higlightZone(zone: string) {
    if (this.globalSelection[zone].layerID != this.selectedLayer) {
      this.setLayer(this.globalSelection[zone].layerID);
    }
    this.highlighted = zone;
    let ext = this.globalSelection[zone].getGeometry().getExtent();
    let center = olExtent.getCenter(ext);
    //this.map.getView().fit(ext, this.map.getSize());
    this.map.getView().animate({
      center: center,
      zoom: this.globalSelection[zone].selectedAtZoom,
      duration: 500
    })
    this.vectorLayers[this.selectedLayer].selectionLayer.changed();
  }

/*
  showTip(zone: string, event) {
    this.popup.nativeElement.innerHTML = zone;
    this.popup.nativeElement.hidden = false;
    this.popupOverlay.setPosition((event.clientX, event.clientY));
  }
*/

  ngAfterViewInit(): void {
    this.sideNavService.setMap(this);

    this.popupOverlay = new Overlay({
      element: this.popup.nativeElement,
      offset: [9, 9]
    });
    this.map.addOverlay(this.popupOverlay);

    this.map.getViewport().addEventListener('mouseout', (evt) => {
      //console.log("mouseOut");
      this.popup.nativeElement.innerHTML = '';
      this.popup.nativeElement.hidden = true;
    }, false);

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
