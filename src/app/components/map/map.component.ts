import {Component, OnInit, ChangeDetectionStrategy, Input, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View'
import * as olProj from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
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
import {layerArray, MapService} from "../../services/map.service";

class SelectableVectorTileLayer {
  vectorTileLayer: VectorTile<any>;
  selectionLayer: VectorTile<any>;
  vectorTileSource: VectorTileSource<any>;
  selection: {};

  constructor(private map: Map, private layerID: number, private layerName: string, private globalSelection: {}, private url: string,
              private composeTipCB: (val: object) => string) {

    this.selection = globalSelection

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
        if (this.layerID + '-' + feature.getId() in this.selection) {
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

  composeTip(val) {
    return this.composeTipCB(val);
  }

  selectEvent(event) {
    this.vectorTileLayer.getFeatures(event.pixel).then((features) => {

      const feature = features[0];
      if (!feature) {
        return;
      }

      const fid = feature.getId();
      feature['layerID'] = this.layerID;
      feature['layerName'] = this.layerName;

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
  //wfsLayerGadm: VectorLayer<any>;
  private popupOverlay: Overlay;
  @ViewChild('popup') popup: ElementRef;
  //selectionLayerGadm: VectorTile<any>;
  doSpin: boolean = false;

  vectorLayers: {};

  selectedLayer: number;
  globalSelection: {};



  constructor(private elementRef: ElementRef, private sideNavService: SideNavService, private mapService: MapService) {
  }
  setLayer(layer: number) {
    console.log("Layer chaged on map: " + layer);
    this.vectorLayers[this.selectedLayer].hide();
    //this.vectorLayers[this.selectedLayer].clearSelection();
    this.selectedLayer = layer;
    this.vectorLayers[this.selectedLayer].show();
  }


  ngOnInit() {

    this.vectorLayers = {};
    this.mapService.featureSelection = {};
    this.globalSelection = this.mapService.featureSelection;
    this.selectedLayer = 0;

    layerArray.forEach( (layer,index) => {
      this.vectorLayers[index] = new SelectableVectorTileLayer(this.map, index,
        layer.group + "_" + layer.level, this.globalSelection, layer.url, layer.composeTipCB);
      }
    )

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

  getSelected() {
    console.log("features: " + Object.keys(this.vectorLayers[this.selectedLayer].selection).length);
    return this.vectorLayers[this.selectedLayer].selection;
  }

  compseNames(val) {
    return this.vectorLayers[this.selectedLayer].composeTip(val);
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
