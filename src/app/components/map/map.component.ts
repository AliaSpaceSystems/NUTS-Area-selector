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
  wfs: VectorLayer<any>;
  private popupOverlay: Overlay;
  @ViewChild('popup') popup: ElementRef;
  vtl: VectorTile<any>;
  selectionLayer: VectorTile<any>;
  vtls: VectorTileSource<any>;



  constructor(private elementRef: ElementRef, private sideNavService: SideNavService) {
  }
  setLayer(layer: string) {
    console.log("Layer chaged on map: " + layer);
    if (layer == "tiles") {

      this.map.removeLayer(this.wfs);
      //this.map.addLayer(this.selectionLayer);
      //this.map.addLayer(this.vtl);

      this.vtl.setVisible(true);
      this.selectionLayer.setVisible(true);
      this.wfs.setVisible(false);

    } else {
      //this.map.removeLayer(this.vtl);
      //this.map.removeLayer(this.selectionLayer);
      this.map.addLayer(this.wfs);

      this.vtl.setVisible(false);
      this.selectionLayer.setVisible(false);
      this.wfs.setVisible(true);
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
    //Définition du layer WFS "WFS GL Data",
    /*
        let vectorLayer = new VectorSource({
          format: new GML(),
          url: function(extent) {
            //return 'https://geodienste.hamburg.de/HH_WFS_Statistik_Stadtteile_Wahlergebnisse' +
            //  '?version=1.1.0&service=WFS&request=GetFeature&' +
            //  'typename=wahlergebnis_buew_afd_prz_15022015';
            return 'https://www.euro-geo-opendata.eu/api/v2/maps/external/wfs/open-euroglobalmap-feature-service?' +
              'SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0
          },
          strategy: bbox
        });
    */
    const vectorSource = new VectorSource({
      format: new GML3(),
      url: function (extent, resolution) {
        //console.log("this.view.getResolution() = " + View..getResolution());
        //console.log("resolution" + resolution);
        //if (resolution > 200) return undefined;
        return (
          /*
          'https://ahocevar.com/geoserver/wfs?service=WFS&' +
          'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
          'outputFormat=application/json&srsname=EPSG:3857&' +
          'bbox=' +
          extent.join(',') +
          ',EPSG:3857'*/
          //-----------------topp:tasmania_water_bodies
          /*
          'https://www.euro-geo-opendata.eu/api/v2/maps/external/wfs/euro-global-map?' +
          'token=Im1hdXJpemlvX2Nlcm9saW5pIg.E-rmJA.kFrWtt8ojfZw6vn-8njIwRtDA8c' +
          '&version=2.0.0&typeNames=EUROGLOBALMAP.ADMINISTRATIVE.BOUNDARIES:polbnda_optionks&srsName=EPSG:3857' +
          '&bbox=' +
          extent.join(',') +
          '&service=WFS&request=GetFeature&outputFormat=gml3'
           */
          'http://51.210.249.119:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetFeature&outputFormat=gml3' +
          '&bbox=' +
          extent.join(',') +
          '&srsName=EPSG:3857&typeName=gadm'
        );
      },
      strategy: bboxStrategy,
    });

    this.vtls = new VectorTileSource({
      tilePixelRatio: 1, // oversampling when > 1
      tileGrid: createXYZ({maxZoom: 19}),
      format: new MVT({featureClass: Feature}),
      url: 'http://51.210.249.119:8080/geoserver/gwc/service/tms/1.0.0/gadm%3Agadm@EPSG%3A3857@pbf' +
        '/{z}/{x}/{-y}.pbf'
    })

    this.vtl = new VectorTile({

      style: new Style({
        stroke: new Stroke({
          color: 'rgba(0, 255, 0, 1.0)',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),

      source: this.vtls
    });

    this.wfs = new VectorLayer({
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

    /*
    this.wfs = new VectorLayer({
      strategies: [new OpenLayers.Strategy.BBOX()],
      protocol: new OpenLayers.Protocol.WFS({
        version: "1.1.0",
        srsName: "EPSG:4326",
        url: data_url,
        featurePrefix : 'ms',
        featureType: "jcd_jcdecaux.jcdvelov",
        geometryName: "msGeometry",
        formatOptions: {
          xy: false
        }
      }),
      styleMap: new OpenLayers.StyleMap(style),
      renderers: OpenLayers.Layer.Vector.prototype.renderers
    });
    -------------------------------
    var wfs2 = new OpenLayers.Layer.Vector("WFS", {
                    strategies: [new OpenLayers.Strategy.Fixed()],
                    protocol: new OpenLayers.Protocol.WFS({
                    version: "1.1.0",
                    url: "http://localhost:8080/geoserver/wfs",
                    featurePrefix: "topp",
                    featureType: "states",
                    featureNS: "www.openplans.org/topp",
                    srsName: "EPSG:4326",
                    geometryName: "position"
                  })
         });
     */
    this.map.addLayer(this.vtl);
    // Selection
    let selection = {};

    this.selectionLayer = new VectorTile({
      map: this.map,
      renderMode: 'vector',
      source: this.vtl.getSource(),
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

      this.vtl.getFeatures(event.pixel).then( (features) => {
        if (!features.length) {
          selection = {};
          this.selectionLayer.changed();
          return;
        }
        const feature = features[0];
        if (!feature) {
          return;
        }
        const fid = feature.getId();
        //console.log("event.shiftKeyOnly: " + event.condition.shiftKeyOnly());
        if (condition.shiftKeyOnly(event) !== true && condition.platformModifierKeyOnly(event) !== true) {
          selection = {};
        }
        // add selected feature to lookup
        selection[fid] = feature;

        this.selectionLayer.changed();
      });
    });
    //const select = new Select({
    //  style: selectedStyleFunction
    //});

    //
    //this.map.addLayer(this.wfs);

    //this.map.addInteraction(new Select());
/*
    this.map.on('click', function (e) {
      let pixel = this.getEventPixel(e.originalEvent);
      this.forEachFeatureAtPixel(pixel, function (feature) {
        console.log("id: " + feature.getId());
        feature.set('state', 'selected', true);
      });
    });
*/
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
        //if (feature != null)
          //{
            //console.log("move forEachFeatureAtPixel: node_id: " + feature.getId());
            //console.log("move forEachFeatureAtPixel: node_prop: " + feature.getProperties()['NAME_3']);
          //}

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

            //console.log("valuesToShow: " + valuesToShow)
            if (valuesToShow.length == 1) {
              //console.log("compseNames: " + typeof valuesToShow[0]['NAME_4']);
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

  }
}
