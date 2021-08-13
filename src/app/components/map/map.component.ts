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



  constructor(private elementRef: ElementRef, private sideNavService: SideNavService) {
  }
  setLayer(layer: string) {
    console.log("Layer chaged on map: " + layer);
    if (layer == "tiles") {

      this.map.removeLayer(this.wfsLayerGadm);
      //this.map.addLayer(this.selectionLayer);
      //this.map.addLayer(this.vtl);

      this.vectorTileLayerGadm.setVisible(true);
      this.selectionLayerGadm.setVisible(true);
      this.wfsLayerGadm.setVisible(false);

    } else {
      //this.map.removeLayer(this.vtl);
      //this.map.removeLayer(this.selectionLayer);
      this.map.addLayer(this.wfsLayerGadm);

      this.vectorTileLayerGadm.setVisible(false);
      this.selectionLayerGadm.setVisible(false);
      this.wfsLayerGadm.setVisible(true);
    }
  }
  ngOnInit() {

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

    this.vectorTileSourceGadm = new VectorTileSource({
      tilePixelRatio: 1, // oversampling when > 1
      tileGrid: createXYZ({maxZoom: 19}),
      format: new MVT({featureClass: Feature}),
      url: 'http://51.210.249.119:8080/geoserver/gwc/service/tms/1.0.0/gadm%3Agadm@EPSG%3A3857@pbf' +
        '/{z}/{x}/{-y}.pbf'
    })

    this.vectorTileLayerGadm = new VectorTile({

      style: new Style({
        stroke: new Stroke({
          color: 'rgba(0, 255, 0, 1.0)',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),

      source: this.vectorTileSourceGadm
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

    this.map.addLayer(this.vectorTileLayerGadm);

    let selection = {};

    this.selectionLayerGadm = new VectorTile({
      map: this.map,
      renderMode: 'vector',
      source: this.vectorTileLayerGadm.getSource(),
      style: function (feature) {
        if (feature.getId() in selection) {
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

    this.map.on(['click'], (event) => {

      this.vectorTileLayerGadm.getFeatures(event.pixel).then( (features) => {
        if (!features.length) {
          selection = {};
          this.selectionLayerGadm.changed();
          return;
        }
        const feature = features[0];
        if (!feature) {
          return;
        }
        const fid = feature.getId();

        if (condition.shiftKeyOnly(event) !== true && condition.platformModifierKeyOnly(event) !== true) {
          selection = {};
        }
        // add selected feature to lookup
        selection[fid] = feature;

        this.selectionLayerGadm.changed();
      });
    });

  };

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

          function compseNames(val) {
            let res = ""
            if (typeof val['NAME_1'] == "string") res += val['NAME_1']; else return "";
            if (typeof val['NAME_2'] == "string") res += '<br>' + val['NAME_2']; else return res;
            if (typeof val['NAME_3'] == "string") res += '<br>' + val['NAME_3']; else return res;
            if (typeof val['NAME_4'] == "string") res += '<br>' + val['NAME_4']; else return res;
            if (typeof val['NAME_5'] == "string") res += '<br>' + val['NAME_5']; else return res;
            return res;
          }


          const valuesToShow = [];
          if (features && features.length > 0) {
            features.forEach( clusterFeature => {
             valuesToShow.push(clusterFeature.getProperties());
            });

            if (valuesToShow.length == 1) {
              this.popup.nativeElement.innerHTML = compseNames(valuesToShow[0]) ;
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
