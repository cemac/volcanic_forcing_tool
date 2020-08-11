
/** global variables: **/

/* init these: */
var container000Div, container000DivHeight, container000DivWidth,
    container010Div, container010DivHeight, container010DivWidth,
    title000Div,
    container020Div, container020DivHeight, container020DivWidth,
    select000Div, select010Div;

/* initial plot type: */
var plotType = globalConfig['default_plot_type'];
/* initial data type: */
var defaultDataType = globalConfig['default_data_type'];
var dataType = defaultDataType;
/* data directory: */
var dataDir = globalConfig['data_directory'];
/* dataFiles which have been fetched: */
var dataFiles = [];
/* init axes and plot data: */
var x = {};
var y = {};
var z = {};
var axesData    = {};
var varData     = {};
var plotData    = {};
var plotIndexes = {};
var maskData    = {};
var maskSlCount = 0;

/** functions: **/

/* init variable values: */
function initVariables() {
  /* content elements: */
  container000Div     = document.getElementById('container000');
  container010Div     = document.getElementById('container010');
  title000Div         = document.getElementById('title000');
  container020Div     = document.getElementById('container020');
  select000Div        = document.getElementById('select000');
  select010Div        = document.getElementById('select010');
}

/* init select buttons: */
function initButtons() {
  /* button labels: */
  var pBLa = globalConfig['plot_button_label'];
  var dBLa = globalConfig['data_button_label'];
  /* init innerHTML: */
  select000Div.innerHTML = '<label>' + pBLa + '</label><br>';
  select010Div.innerHTML = '<label>' + dBLa + '</label><br>';
  /* for each plot type: */
  for (var key in globalConfig.plotTypes) {
    /* plot type name and label: */
    var pTN = globalConfig['plotTypes'][key]['name'];
    var pTL = globalConfig['plotTypes'][key]['label'];
    /* create button: */
    select000Div.innerHTML = select000Div.innerHTML +
      '<button id=\'select-plot-type-' +
      pTN +
      '\' class=\'button-plot_type\'>' +
      pTL +
      '</button>';
  }
  /* for each data type: */
  for (var key in globalConfig['dataTypes']) {
    /* data type name and label: */
    var dTN = globalConfig['dataTypes'][key]['name'];
    var dTL = globalConfig['dataTypes'][key]['label'];
    /* visible?: */
    var dTV = globalConfig['dataTypes'][key]['sel_visible'];
    /* create button: */
    if (dTV == true) {
      select010Div.innerHTML = select010Div.innerHTML +
        '<button id=\'select-plot-data-' +
        dTN +
        '\' class=\'button-data_type\'>' +
        dTL +
        '</button>';
    }
  }
}

/* function to update single button: */
function updateButton(iD, eN, pT, dT, dI) {
  /* element by id: */
  var bEl = document.getElementById(iD);
  /* enable / disable: */
  if (eN == true) {
    bEl.removeAttribute('disabled');
    bEl.onclick = function() {
      startPlot(pT, dT);
    };
  } else {
    bEl.setAttribute('disabled', true);
    bEl.onclick = null;
  }
}

/* function to update buttons: */
function updateButtons() {
  /* for each plot type: */
  for (var key in globalConfig['plotTypes']) {
    /* plot type name: */
    var pTN = globalConfig['plotTypes'][key]['name'];
    /* if matches global plot type: */
    if (pTN == plotType) {
      /* disable button: */
      updateButton('select-plot-type-' + pTN,
                   false,
                   null, null, null);
    } else {
      /* enable button: */
      updateButton('select-plot-type-' + pTN,
                   true,
                   pTN, dataType, 0);
    }
  }
  /* for each data type: */
  for (var key in globalConfig['dataTypes']) {
    /* data type name: */
    var dTN = globalConfig['dataTypes'][key]['name'];
    /* if visible: */
    var dTV = globalConfig['dataTypes'][key]['sel_visible'];
    if (dTV == true) {
      /* if matches global data type: */
      if (dTN == dataType) {
        /* disable button: */
        updateButton('select-plot-data-' + dTN,
                     false,
                     null, null);
      } else {
        /* enable button: */
        updateButton('select-plot-data-' + dTN,
                     true,
                     plotType, dTN);
      }
    }
  }
}

/* init plot divs(s): */
function initPlotDivs() {
  /* set title: */
  var pgTi = globalConfig['page_title'];
  document.title = pgTi;
  /* init plot conatined: */
  container020Div.innerHTML = '';
  /* slider?: */
  var dSL = globalConfig['plotTypes'][plotType]['slider'];
  /* mask slider?: */
  var dMS = globalConfig['plotTypes'][plotType]['mask'];
  /* check width: */
  var sPMPW = globalConfig['subplot_min_page_width'];
  /* if subplots: */
  var dSP = globalConfig['plotTypes'][plotType]['subplots'];
  if (dSP == true) {
    /* one plot for each dimension ... : */
    for (var key in globalConfig['axes']['axes_dims']) {
      /* dimension name and label: */
      var dN = globalConfig['axes']['axes_dims'][key]['name'];
      var dL = globalConfig['axes']['axes_dims'][key]['label'];
      /* create div: */
      var hT = '';
      hT = hT +
        '<div id=\'container-' + plotType + '-' +
        dN +
        '\' class=\'container-' + plotType + '\'>';
      /* plot div: */
      hT = hT +
        '<div id=\'plot-' + plotType + '-' +
        dN +
        '\'>' +
        '</div>'
      /* if slider: */
      if (dSL == true) {
        hT = hT +
          '<div id=\'container-slider-' +
          plotType + '-' + dN +
          '\' class=\'container-slider\'>' +
          '<div id=\'label-slider-' +
          plotType + '-' + dN +
          '\' class=\'label-slider\'>' +
          '</div>' +
          '<div id=\'slider-' +
          plotType + '-' + dN +
          '\' class=\'slider\'>' +
          '</div>' +
          '</div>';
      }
      /* if mask slider: */
      if (dMS == true) {
        /* mask labels .. set to empty here: */
        hT = hT +
          '<div id=\'title-mask-slider-' +
          plotType + '-' + dN +
          '\' class=\'title-mask-slider\'>' +
          '&nbsp;' +
          '</div>';
        /* sliders: */
        hT = hT +
          '<div id=\'container-mask-slider-' +
          plotType + '-' + dN +
          '\' class=\'container-mask-slider\'>' +
          '<div id=\'label-mask-slider-' +
          plotType + '-' + dN +
          '\' class=\'label-slider\'>' +
          '</div>' +
          '<div id=\'mask-slider-' +
          plotType + '-' + dN +
          '\' class=\'slider\'>' +
          '</div>' +
          '</div>';
      }
      /* close div: */
      hT = hT +
        '</div>';
      container020Div.innerHTML = container020Div.innerHTML + hT;
    }
  } else {
    /* no subplots ... create div: */
    var hT = '';
    hT = hT +
      '<div id=\'container-' + plotType +
      '\' class=\'container-' + plotType + '\'>';
    /* plot div: */
    hT = hT +
      '<div id=\'plot-' + plotType +
      '\'>' +
      '</div>';
    /* if slider: */
    if (dSL == true) {
      hT = hT +
        '<div id=\'container-slider' +
        '\' class=\'container-slider\'>' +
        '<div id=\'label-slider-' + plotType +
        '\' class=\'label-slider\'>' +
        '</div>' +
        '<div id=\'slider-' + plotType +
        '\' class=\'slider\'>' +
        '</div>' +
        '</div>';
    }
    /* if mask slider: */
    if (dMS == true) {
      /* mask labels .. set to empty here: */
      hT = hT +
        '<div id=\'title-mask-slider-' +
        plotType +
        '\' class=\'title-mask-slider\'>' +
        '&nbsp;' +
        '</div>';
      /* slider: */
      hT = hT +
        '<div id=\'container-mask-slider' +
        '\' class=\'container-mask-slider\'>' +
        '<div id=\'label-mask-slider-' + plotType +
        '\' class=\'label-slider\'>' +
        '</div>' +
        '<div id=\'mask-slider-' + plotType +
        '\' class=\'slider\'>' +
        '</div>' +
        '</div>';
    }
    /* close div: */
    hT = hT +
      '</div>';
    container020Div.innerHTML = container020Div.innerHTML + hT;
  }
}

/* add slider listeners: */
function addSliderListener(sEl, lEl, sLa, aN) {
  /* add slider change listener: */
  sEl.noUiSlider.on('change', function() {
    /* get slider value and index: */
    var sVal = sEl.noUiSlider.get();
    var sIn  = z[plotType][aN].data.indexOf(parseFloat(sVal));
    /* update plot indexes: */
    plotIndexes[aN] = sIn;
    processIndexData(updatePlotDataType);
  });
  /* add slide listener to slider element: */
  sEl.noUiSlider.on('slide', function() {
    var sVal = sEl.noUiSlider.get();
    lEl.innerHTML = '<label>' + sLa + '</label>: ' + sVal;
  });
}

/* set up sliders: */
function initSliders() {
  /* slider?: */
  var dSL = globalConfig['plotTypes'][plotType]['slider'];
  /* subplots?: */
  var dSP = globalConfig['plotTypes'][plotType]['subplots'];
  /* slider enable? */
  var sEn = globalConfig['dataTypes'][dataType]['slider_enable'];
  /* only if slider: */
  if (dSL == true) {
    /* if subplots: */
    if (dSP == true) {
      /* one slider for each dimension ... : */
      for (var key in globalConfig['axes']['axes_dims']) {
        /* dimension name and label: */
        var dN = globalConfig['axes']['axes_dims'][key]['name'];
        var dL = globalConfig['axes']['axes_dims'][key]['label'];
        /* current plot index: */
        var pIn = plotIndexes[key];
        /* label element: */
        var lEl = document.getElementById('label-slider-' + plotType + '-' + dN);
        /* slider element: */
        var sEl = document.getElementById('slider-' + plotType + '-' + dN);
        /* set label: */
        lEl.innerHTML = '<label>' + dL + '</label>: ';
        /* if no slider: */
        if (!sEl.noUiSlider) {
          /* create slider: */
          noUiSlider.create(sEl, {
            start: 0,
            range: {
              'min': 0,
              'max': 100
            },
            tooltips: false,
            snap: true
          });
          /* add slider listener: */
          addSliderListener(sEl, lEl, dL, key);
        }
        /* if enabled: */
        if (sEn == true) {
          sEl.removeAttribute('disabled');
          /* slider range: */
          var sRV = {
            'min': z[plotType][key]['min'],
            'max': z[plotType][key]['max'],
          }
          /* range length and increment: */
          var sRL = z[plotType][key]['data'].length;
          var sRI = 100 / (sRL - 1);
          /* range values: */
          for (var rIn = 1; rIn < (sRL - 1); rIn++) {
            var rKey = (rIn*sRI).toFixed(2).toString() + '%';
            var rVal = z[plotType][key]['data'][rIn];
            sRV[rKey] = rVal;
          }
          /* update slider: */
          sEl.noUiSlider.updateOptions({
            range: sRV,
          });
          /* set slider position: */
          sEl.noUiSlider.set(z[plotType][key]['data'][pIn]);
          /* set label value: */
          lEl.innerHTML = '<label>' + dL + '</label>: ' + z[plotType][key]['data'][pIn];
        } else {
          /* update plot indexes: */
          plotIndexes[key] = pIn;
          /* disable slider: */
          sEl.setAttribute('disabled', true);
        }
      }
    } else {
      /* dimension label: */
      var sL = globalConfig['plotTypes'][plotType]['slider_label'];
      /* just one plot / slider ... label element: */
      var lEl = document.getElementById('label-slider-' + plotType);
      /* slider element: */
      var sEl = document.getElementById('slider-' + plotType);
      /* set label: */
      lEl.innerHTML = '<label>' + sL + '</label>: ';
      /* create slider: */
      noUiSlider.create(sEl, {
        start: 0,
        range: {
          'min': 0,
          'max': 100
        },
        tooltips: false,
        snap: true
      });
      /* if enabled: */
      if (sEn == true) {
        /* not yet implemented ... disable slider: */
        sEl.setAttribute('disabled', true);
      } else {
        /* update plot indexes: */
        plotIndexes[key] = pIn;
        /* disable slider: */
        sEl.setAttribute('disabled', true);
      }
    }
  }
}

/* add mask slider listeners: */
function addMaskSliderListener(sEl, lEl, aN) {
  /* add slider change listener: */
  sEl.noUiSlider.on('change', function() {
    /* get slider value and index: */
    var sVal = sEl.noUiSlider.get();
    /* update maskData min / max ... if key value: */
    if (aN != null) {
      maskData[plotType][dataType][aN]['min'] = parseFloat(sVal[0]);
      maskData[plotType][dataType][aN]['max'] = parseFloat(sVal[1]);
      processIndexData(updatePlotDataType);
    } else {
      maskData[plotType][dataType]['min'] = parseFloat(sVal[0]);
      maskData[plotType][dataType]['max'] = parseFloat(sVal[1]);
      processData(updatePlotDataType);
    }
  });
  /* add slide listener to slider element: */
  sEl.noUiSlider.on('slide', function() {
    var sVal = sEl.noUiSlider.get();
    var sLa = globalConfig['dataTypes'][dataType]['mask_label'];
    lEl.innerHTML = '<label>' + sLa + '</label>: ' + sVal[0] + ' : ' + sVal[1];
  });
}

/* set up mask sliders: */
function initMaskSliders() {
  /* mask slider?: */
  var dMS = globalConfig['plotTypes'][plotType]['mask'];
  /* subplots?: */
  var dSP = globalConfig['plotTypes'][plotType]['subplots'];
  /* mask slider enable? */
  var sEn = globalConfig['dataTypes'][dataType]['mask_enable'];
  /* only if mask slider: */
  if (dMS == true) {
    /* if subplots: */
    if (dSP == true) {
      /* one slider for each dimension ... : */
      for (var key in globalConfig['axes']['axes_dims']) {
        /* dimension name and label: */
        var dN = globalConfig['axes']['axes_dims'][key]['name'];
        var dL = globalConfig['axes']['axes_dims'][key]['label'];
        /* data name and label: */
        var daN = globalConfig['dataTypes'][dataType]['name'];
        var daL = globalConfig['dataTypes'][dataType]['mask_label'];
        /* current plot index: */
        var pIn = plotIndexes[key];
        /* label element: */
        var lEl = document.getElementById('label-mask-slider-' + plotType + '-' + dN);
        /* slider element: */
        var sEl = document.getElementById('mask-slider-' + plotType + '-' + dN);
        /* set label: */
        lEl.innerHTML = '<label>' + daL + '</label>: ';
        /* if no slider: */
        if (!sEl.noUiSlider) {
          /* create slider: */
          noUiSlider.create(sEl, {
            start: [0, 100],
            connect: true,
            range: {
              'min': 0,
              'max': 100
            },
            step: 10,
            margin: 10,
            tooltips: false
          });
          /* add mask slider listener: */
          addMaskSliderListener(sEl, lEl, key);
        }
        /* if enabled: */
        if (sEn == true) {
          sEl.removeAttribute('disabled');
          /* slider range: */
          var SRmin = Math.floor(plotData[plotType][dataType][key][plotIndexes[key]]['min']);
          var SRmax = Math.ceil(plotData[plotType][dataType][key][plotIndexes[key]]['max']);
          var sRV = {
            'min': SRmin,
            'max': SRmax
          }
          /* range length and increment: */
          var sRL = globalConfig['dataTypes'][dataType]['mask_values'];
          var sRMS = globalConfig['dataTypes'][dataType]['mask_min_step'];
          var sRI = 100 / (sRL - 1);
          var sRDI = (SRmax - SRmin) / sRL;
          /* try an round increment to 0.5 or 1.0: */
          if (sRDI < 1) {
            sRDI = Math.round(sRDI*2)/2;
          } else {
            sRDI = Math.round(sRDI);
          }
          /* update slider: */
          sEl.noUiSlider.updateOptions({
            range: sRV,
            step: sRDI,
            margin: sRDI * sRMS
          });
          /* get / set min / max: */
          if (! maskData[plotType][dataType][key]['min']) {
            maskData[plotType][dataType][key]['min'] = SRmin;
          }
          if (! maskData[plotType][dataType][key]['max']) {
            maskData[plotType][dataType][key]['max'] = SRmax;
          }
          /* set slider position: */
          sEl.noUiSlider.set([
            maskData[plotType][dataType][key]['min'],
            maskData[plotType][dataType][key]['max']
          ]);
          /* set label value: */
          lEl.innerHTML = '<label>' + daL + '</label>: ' +
            maskData[plotType][dataType][key]['min'].toFixed(2) + ' : ' +
            maskData[plotType][dataType][key]['max'].toFixed(2);
        } else {
          /* update plot indexes: */
          plotIndexes[key] = pIn;
          /* disable slider: */
          sEl.setAttribute('disabled', true);
        }
      }
    } else {
      /* data name and label: */
      var daN = globalConfig['dataTypes'][dataType]['name'];
      var daL = globalConfig['dataTypes'][dataType]['mask_label'];
      /* just one plot / slider ... label element: */
      var lEl = document.getElementById('label-mask-slider-' + plotType);
      /* slider element: */
      var sEl = document.getElementById('mask-slider-' + plotType);
      /* set label: */
      lEl.innerHTML = '<label>' + daL + '</label>: ';
      /* if no slider: */
      if (!sEl.noUiSlider) {
        /* create slider: */
        noUiSlider.create(sEl, {
          start: [0, 100],
          connect: true,
          range: {
            'min': 0,
            'max': 100
          },
          step: 10,
          margin: 10,
          tooltips: false
        });
        /* add mask slider listener: */
        addMaskSliderListener(sEl, lEl, null);
      }
      /* if enabled: */
      if (sEn == true) {
        sEl.removeAttribute('disabled');
        /* slider range: */
        var SRmin = Math.floor(plotData[plotType][dataType]['min']);
        var SRmax = Math.ceil(plotData[plotType][dataType]['max']);
        var sRV = {
          'min': SRmin,
          'max': SRmax
        }
        /* range length and increment: */
        var sRL = globalConfig['dataTypes'][dataType]['mask_values'];
        var sRMS = globalConfig['dataTypes'][dataType]['mask_min_step'];
        var sRI = 100 / (sRL - 1);
        var sRDI = (SRmax - SRmin) / sRL;
        /* try an round increment to 0.5 or 1.0: */
        if (sRDI < 1) {
          sRDI = Math.round(sRDI*2)/2;
        } else {
          sRDI = Math.round(sRDI);
        }
        /* update slider: */
        sEl.noUiSlider.updateOptions({
          range: sRV,
          step: sRDI,
          margin: sRDI * sRMS
        });
        /* get / set min / max: */
        if (! maskData[plotType][dataType]['min']) {
          maskData[plotType][dataType]['min'] = SRmin;
        }
        if (! maskData[plotType][dataType]['max']) {
          maskData[plotType][dataType]['max'] = SRmax;
        }
        /* set slider position: */
        sEl.noUiSlider.set([
          maskData[plotType][dataType]['min'],
          maskData[plotType][dataType]['max']
        ]);
        /* set label value: */
        lEl.innerHTML = '<label>' + daL + '</label>: ' +
          maskData[plotType][dataType]['min'].toFixed(2)  + ' : ' +
          maskData[plotType][dataType]['max'].toFixed(2);
      } else {
        /* update plot indexes: */
        plotIndexes[key] = pIn;
        /* disable slider: */
        sEl.setAttribute('disabled', true);
      }
    }
  }
}

/* purge plots: */
function purgePlots() {
  /* plot divs: */
  var pD = document.getElementsByClassName('js-plotly-plot');
  /* purge each plot: */
  for (var i = 0; i < pD.length; i++) {
    Plotly.purge(pD[i]);
  }
}

/* get axes data: */
function getAxesData(cB) {
  var axesDataFile = globalConfig['dataTypes'][dataType]['axes_data'];
  /* if data file has not yet been fetched: */
  if (dataFiles.indexOf(axesDataFile) == -1) {
    /* get the data. this will also process and plot on
       completion of data download: */
    getData(axesDataFile, dataType, true);
  } else {
    /* already downloaded ... process the data: */
    processAxesData(continuePlot);
  }
}

/* start plotting: */
function startPlot(pT, dT) {
  /* if this plot type does not match existing plot type: */
  if(pT != plotType) {
    /* this is a new plot: */
    newPlot = true;
  } else {
    /* this is not a new plot: */
    newPlot = false;
  }
  /* set plotType: */
  plotType = pT;
  /* set dataType: */
  dataType = dT;
  /* if this is a new plot: */
  if (newPlot == true) {
    /* purge any plots: */
    purgePlots();
    /* init plot divs and sliders: */
    initPlotDivs();
  }
  /* update buttons: */
  updateButtons();
  /* getAxesdata: */
  getAxesData();
}

/* continue plotting ... : */
function continuePlot() {
  /* data file: */
  var dataFile = globalConfig['dataTypes'][dataType]['plot_data'];
  /* if data file is defined: */
  if (dataFile) {
    /* if data file has not yet been fetched: */
    if (dataFiles.indexOf(dataFile) == -1) {
      /* get the data. this will also process and plot on
         completion of data download: */
      getData(dataFile, dataType, false);
    } else {
      /* if new plot: */
      if (newPlot == true) {
        /* already downloaded ... process and plot the data: */
        processData(plotNewPlot);
      } else {
        /* already downloaded ... process and update plot: */
        processData(updatePlotDataType);
      }
    }
  }
}

/* download data: */
function getData(dF, dT, aX) {
  /* name of file to download: */
  var downloadFile = dataDir + '/' + dF;
  /* fetch compressied json data: */
  var req = new XMLHttpRequest();
  req.overrideMimeType('application/octet-stream');
  req.open('GET', downloadFile, true);
  /* on data download: */
  req.onload = function() {
    var compressedData = req.responseText;
    /* extract data ... if axes: */
    if (aX == true) {
      extractData(compressedData, dT, aX, processAxesData, continuePlot);
    } else {
      /* if new plot: */
      if (newPlot == true) {
        extractData(compressedData, dT, aX, processData, plotNewPlot);
      } else {
        extractData(compressedData, dT, aX, processData, updatePlotDataType);
      }
    }
  }
  req.send(null);
  /* update record of downloaded data files: */
  dataFiles.push(dF);
}

/* extract compressed data: */
function extractData(cD, dT, aX, cB, cBa) {
  /* if we have compressed data: */
  if (cD != 0) {
    /* decompress data: */
    var compressedData   = JSON.parse(pako.inflate(cD, { to: 'string' }));
    var uncompressedData = JSON.parse(compressedData);
    /* set variables from data ... if axes: */
    if (aX == true) {
      /* for each key: */
      for (var key in uncompressedData) {
        /* only if we don't have this data: */
        if (!axesData[key]) {
          /* add to axesData: */
          axesData[key] = uncompressedData[key];
        }
      }
    } else {
      /* for each key: */
      for (var key in uncompressedData) {
        /* only if we don't have this data: */
        if (!varData[key]) {
          /* add to varData: */
          varData[key] = {};
          varData[key]['data'] = uncompressedData[key];
          varData[key]['min']  = Math.min.apply(null, varData[key]['data']);
          varData[key]['max']  = Math.max.apply(null, varData[key]['data']);
          /* override min and max values if specified in config: */
          var dataMinValue = globalConfig['dataTypes'][dataType]['data_min_value'];
          if (dataMinValue != undefined) {
            varData[key]['min']  = dataMinValue;
          }
          var dataMaxValue = globalConfig['dataTypes'][dataType]['data_max_value'];
          if (dataMaxValue != undefined) {
            varData[key]['max']  = dataMaxValue;
          }
          /* make sure mask data values are set: */
          for (var pT in globalConfig['plotTypes']) {
            if (! maskData[pT]) {
              maskData[pT] = {};
            }
            if (! maskData[pT][dataType]) {
              maskData[pT][dataType] = {};
            }
            if (globalConfig['plotTypes'][pT]['subplots'] == true) {
              for (var sP in globalConfig['axes']['axes_dims']) {
                if (! maskData[pT][dataType][sP]) {
                  maskData[pT][dataType][sP] = {};
                }
                maskData[pT][dataType][sP]['min'] = Math.floor(varData[key]['min']);
                maskData[pT][dataType][sP]['max'] = Math.ceil(varData[key]['max']);
              }
              var pI = plotIndexes[sP];
              if (pI == undefined) { pI = 0; }
              processIndexData();
            } else {
              maskData[pT][dataType]['min'] = Math.floor(varData[key]['min']);
              maskData[pT][dataType]['max'] = Math.ceil(varData[key]['max']);
              processData();
            }
          }
        }
      }
    }
  }
  /* extract complete ... callback: */
  if (cB && typeof(cB) === "function") {
    cB(cBa);
  }
}

/* filter unique values from array ... : */
function returnUnique(aRa) {
  var aRb = [];
  for (var i=0, l=aRa.length; i<l; i++) {
    if (aRb.indexOf(aRa[i]) === -1 && aRa[i] !== '') {
      aRb.push(aRa[i]);
    }
  }
  return aRb;
}

/* process axes data: */
function processAxesData(cB) {
  /* if subplots: */
  var sPL = globalConfig['plotTypes'][plotType]['subplots'];
  if (sPL == true) {
    /* add x values for this plot type: */
    if (!x[plotType]) {
      x[plotType] = {};
      /* for each dimension: */
      for (key in globalConfig['axes']['axes_dims']) {
        /* if x values not set: */
        if (!x[plotType][key]) {
          x[plotType][key] = {};
          /* get x value from config: */
          var xV = globalConfig['axes']['axes_dims'][key]['x'];
          /* set values: */
          x[plotType][key]['data'] = returnUnique(axesData[xV]);
          x[plotType][key]['min']  = Math.min.apply(null, x[plotType][key]['data']);
          x[plotType][key]['max']  = Math.max.apply(null, x[plotType][key]['data']);
        }
      }
    }
    /* add y values for this plot type: */
    if (!y[plotType]) {
      y[plotType] = {};
      /* for each dimension: */
      for (key in globalConfig['axes']['axes_dims']) {
        /* if y values not set: */
        if (!y[plotType][key]) {
          y[plotType][key] = {};
          /* get y value from config: */
          var yV = globalConfig['axes']['axes_dims'][key]['y'];
          /* set values: */
          y[plotType][key]['data'] = returnUnique(axesData[yV]);
          y[plotType][key]['min']  = Math.min.apply(null, y[plotType][key]['data']);
          y[plotType][key]['max']  = Math.max.apply(null, y[plotType][key]['data']);
        }
      }
    }
    /* add z values for this plot type: */
    if (!z[plotType]) {
      z[plotType] = {};
      /* for each dimension: */
      for (key in globalConfig['axes']['axes_dims']) {
        /* if z values not set: */
        if (!z[plotType][key]) {
          z[plotType][key] = {};
          /* get z value from name: */
          var zV = globalConfig['axes']['axes_dims'][key]['name'];
          /* set values: */
          z[plotType][key]['data'] = returnUnique(axesData[zV]);
          z[plotType][key]['min'] = Math.min.apply(null, z[plotType][key]['data']);
          z[plotType][key]['max'] = Math.max.apply(null, z[plotType][key]['data']);
        }
      }
    }
  } else {
    /* add x, y and z values for this plot type ... x: */
    if (!x[plotType]) {
      x[plotType] = {};
      /* get x variable from config: */
      var xV = globalConfig['plotTypes'][plotType]['x'];
      /* set values: */
      x[plotType]['data'] = axesData[xV];
      x[plotType]['min']  = Math.min.apply(null, x[plotType]['data']);
      x[plotType]['max']  = Math.max.apply(null, x[plotType]['data']);
    }
    /* y: */
    if (!y[plotType]) {
      y[plotType] = {};
      /* get y variable from config: */
      var yV = globalConfig['plotTypes'][plotType]['y'];
      /* set values: */
      y[plotType]['data'] = axesData[yV];
      y[plotType]['min']  = Math.min.apply(null, y[plotType]['data']);
      y[plotType]['max']  = Math.max.apply(null, y[plotType]['data']);
    }
    /* z: */
    if (!z[plotType]) {
      z[plotType] = {};
      /* get z variable from config: */
      var zV = globalConfig['plotTypes'][plotType]['z'];
      /* set values: */
      z[plotType]['data'] = axesData[zV];
      z[plotType]['min']  = Math.min.apply(null, z[plotType]['data']);
      z[plotType]['max']  = Math.max.apply(null, z[plotType]['data']);
    }
  }
  /* callback: */
  if (cB && typeof(cB) === "function") {
    cB();
  }
}

/* process data for an index: */
function processIndexData(cB) {
  /* set plotData value: */
  if (!plotData[plotType]) {
    plotData[plotType] = {};
  }
  /* set plotData dataType value: */
  if (!plotData[plotType][dataType]) {
    plotData[plotType][dataType] = {};
  }
  /* min and max are all the same: */
  var dMin = varData[dataType]['min'];
  var dMax = varData[dataType]['max'];
  /* for each dimension: */
  for (key in globalConfig['axes']['axes_dims']) {
    /* set up mask data: */
    if (! maskData[plotType]) {
      maskData[plotType] = {};
    }
    if (! maskData[plotType][dataType]) {
      maskData[plotType][dataType] = {};
    }
    if (! maskData[plotType][dataType][key]) {
      maskData[plotType][dataType][key] = {};
    }
    /* if plotIndex value not set: */
    if (!plotIndexes[key]) {
      plotIndexes[key] = 0;
    }
    /* get current index value: */
    var i = plotIndexes[key];
    /* if values not set: */
    if (!plotData[plotType][dataType][key]) {
      /* init values: */
      plotData[plotType][dataType][key] = [];
    }
    /* x dimension + length: */
    var xD = globalConfig['axes']['axes_dims'][key]['x'];
    var xL = globalConfig['axes']['axes_dims'][xD]['length'];
    /* y dimension + length: */
    var yD = globalConfig['axes']['axes_dims'][key]['y'];
    var yL = globalConfig['axes']['axes_dims'][yD]['length'];
    /* if nothing for this slice: */
    if (!plotData[plotType][dataType][key][i]) {
      /* init this slice: */
      plotData[plotType][dataType][key][i] = {};
      plotData[plotType][dataType][key][i]['data'] = [];
      /* this index: */
      var iN = i;
      /* offset: */
      iN = (i * globalConfig['axes']['axes_dims'][key]['offset_mult'])
             + globalConfig['axes']['axes_dims'][key]['offset_add'];
      for (var j = 0; j < yL; j=j+1) {
        plotData[plotType][dataType][key][i]['data'][j] = [];
        for (var k = 0; k < xL; k=k+1) {
          plotData[plotType][dataType][key][i]['data'][j][k] = varData[dataType]['data'][iN] || null;
          /* x inc: */
          iN = iN + globalConfig['axes']['axes_dims'][key]['x_inc'];
        }
        /* y inc: */
        iN = iN + globalConfig['axes']['axes_dims'][key]['y_inc'];
      }
      plotData[plotType][dataType][key][i]['min'] = dMin;
      plotData[plotType][dataType][key][i]['max'] = dMax;
    }
    /* mask data? ... check if mask min and max are set: */
    if ((maskData[plotType][dataType][key]['min'] != undefined) &&
        (maskData[plotType][dataType][key]['max'] != undefined)) {
      /* check if data already exists: */
      if (maskData[plotType][dataType][key]['data'] == undefined) {
        maskData[plotType][dataType][key]['data'] = [];
      }
      /* for this index ... : */
      if (maskData[plotType][dataType][key]['data'][i] == undefined) {
        maskData[plotType][dataType][key]['data'][i] = [];
      }
      /* mask the data ... : */
      for (var mDi = 0; mDi < plotData[plotType][dataType][key][i]['data'].length; mDi++) {
        maskData[plotType][dataType][key]['data'][i][mDi] = [];
        for (var mDj = 0 ; mDj < plotData[plotType][dataType][key][i]['data'][mDi].length; mDj++) {
          if ((plotData[plotType][dataType][key][i]['data'][mDi][mDj] > maskData[plotType][dataType][key]['min']) &&
              (plotData[plotType][dataType][key][i]['data'][mDi][mDj] < maskData[plotType][dataType][key]['max'])) {
            maskData[plotType][dataType][key]['data'][i][mDi][mDj] = plotData[plotType][dataType][key][i]['data'][mDi][mDj];
          } else {
            maskData[plotType][dataType][key]['data'][i][mDi][mDj] = null;
          }
        }
      }
    }
    /* end masking. */
  }
  /* callback: */
  if (cB && typeof(cB) === "function") {
    cB();
  }
}

/* process data: */
function processData(cB) {
  /* if subplots: */
  var sPL = globalConfig['plotTypes'][plotType]['subplots'];
  if (sPL == true) {
    processIndexData(cB);
  } else {
    /* set plotData value: */
    if (!plotData[plotType]) {
      plotData[plotType] = {};
    }
    /* set up mask data: */
    if (! maskData[plotType]) {
      maskData[plotType] = {};
    }
    if (! maskData[plotType][dataType]) {
      maskData[plotType][dataType] = {};
    }
    if (!plotData[plotType][dataType]) {
      plotData[plotType][dataType] = {};
      plotData[plotType][dataType]['data'] = varData[dataType]['data'];
      plotData[plotType][dataType]['min'] = varData[dataType]['min'];
      plotData[plotType][dataType]['max'] = varData[dataType]['max'];
    }
    /* mask data? ... check if mask min and max are set: */
    if ((maskData[plotType][dataType]['min'] != undefined) &&
        (maskData[plotType][dataType]['max'] != undefined)) {
      /* check if data already exists: */
      if (maskData[plotType][dataType]['data'] == undefined) {
        maskData[plotType][dataType]['data'] = [];
      }
      /* mask axes ... : */
      if (maskData[plotType][dataType]['x'] == undefined) {
        maskData[plotType][dataType]['x'] = [];
      }
      if (maskData[plotType][dataType]['y'] == undefined) {
        maskData[plotType][dataType]['y'] = [];
      }
      if (maskData[plotType][dataType]['z'] == undefined) {
        maskData[plotType][dataType]['z'] = [];
      }
      /* mask the data ... : */
      for (var mDi = 0; mDi < plotData[plotType][dataType]['data'].length; mDi++) {
        if ((plotData[plotType][dataType]['data'][mDi] > maskData[plotType][dataType]['min']) &&
            (plotData[plotType][dataType]['data'][mDi] < maskData[plotType][dataType]['max'])) {
          maskData[plotType][dataType]['data'][mDi] = plotData[plotType][dataType]['data'][mDi];
          maskData[plotType][dataType]['x'][mDi] = x[plotType]['data'][mDi];
          maskData[plotType][dataType]['y'][mDi] = y[plotType]['data'][mDi];
          maskData[plotType][dataType]['z'][mDi] = z[plotType]['data'][mDi];
        } else {
          maskData[plotType][dataType]['data'][mDi] = null;
          maskData[plotType][dataType]['x'][mDi] = null;
          maskData[plotType][dataType]['y'][mDi] = null;
          maskData[plotType][dataType]['z'][mDi] = null;
        }
      }
    }
    /* end masking. */
    /* callback: */
    if (cB && typeof(cB) === "function") {
      cB();
    }
  }
}

/* create new plotly plot: */
function plotCreateNewPlot(pCDiv, pCNa, pCTi, pCCS, pCSC,
                           pCCBt, pCCBs, pCCNt, pCMS, pCVi,
                           pCMab, pCMat, pCIw, pCIh, pCClr, pCLi,
                           pCX, pCXmin, pCXmax, pCXTi,
                           pCY, pCYmin, pCYmax, pCYTi,
                           pCZ, pCZmin, pCZmax, pCZTi,
                           pCDmin, pCDmax, pCData, pCLData) {
  /* use plotly to plot the plot: */
  Plotly.newPlot(
    pCDiv,
    [{
      'name': pCNa,
      'visible': pCVi,
      'type': plotType,
      'colorscale': pCCS,
      'showscale': pCSC,
      'contours': {
        'coloring': pCClr
      },
      'colorbar': {
        'title': pCCBt,
        'titleside': pCCBs,
        'nticks': pCCNt
      },
      'x': pCX,
      'y': pCY,
      'z': pCZ,
      'zmin': pCZmin,
      'zmax': pCZmax,
      'line': {'width': pCLi},
      'marker': {'color': pCData, 'colorscale': pCCS,
                 'cmin': pCDmin, 'cmax': pCDmax,
                 'showscale': pCSC, 'size': pCMS,
                 'colorbar': {'title': pCCBt, 'titleside': pCCBs, 'nticks': pCCNt}
                },
      'mode': 'markers',
      'hoverinfo': 'text',
      'text': pCLData
    }],
    {
      'height': pCIh,
      'width': pCIw,
      'margin': {'b': pCMab, 't': pCMat},
      'xaxis': {
        'range': [pCXmin, pCXmax],
        'title': pCXTi,
        'zeroline': false
      },
      'yaxis': {
        'range': [pCYmin, pCYmax],
        'title': pCYTi,
        'zeroline': false
      },
      'scene': {
        'aspectmode': 'cube',
        'xaxis': {
          'title': pCXTi,
          'titlefont': {'color': 'k'},
          'range': [pCXmin, pCXmax]
        },
        'yaxis': {
          'title': pCYTi,
          'titlefont': {'color': 'k'},
          'range': [pCYmin, pCYmax]
        },
        'zaxis': {
          'title': pCZTi,
          'titlefont': {'color': 'k'},
          'range': [pCZmin, pCZmax]
        }
      }
    },
    {
      'showLink': false,
      'linkText': '',
      'displaylogo': false
    }
  );
}

/* update plot data type: */
function updatePlotDataType() {
  /* set inner page title ... : */
  var plTi = globalConfig['dataTypes'][dataType]['title'];
  title000Div.innerHTML = plTi;
  /* plot config: */
  var pCVi   = globalConfig['dataTypes'][dataType]['visible'];
  var pCCS   = globalConfig['dataTypes'][dataType]['colorscale'];
  var pCSC   = globalConfig['dataTypes'][dataType]['showscale'];
  var pCCBt  = globalConfig['dataTypes'][dataType]['cbartitle'];
  var pCCBs  = globalConfig['dataTypes'][dataType]['cbarside'];
  var pCCNt  = globalConfig['dataTypes'][dataType]['cbarnticks'];
  var pCMS   = globalConfig['dataTypes'][dataType]['marker_size'];
  var pCNa   = globalConfig['dataTypes'][dataType]['label'];
  var pCSNa  = globalConfig['dataTypes'][dataType]['shortname'];
  var pCTi   = globalConfig['dataTypes'][dataType]['title'];
  var pCMab  = globalConfig['plotTypes'][plotType]['margin_b'];
  var pCMat  = globalConfig['plotTypes'][plotType]['margin_t'];
  var pCClr  = globalConfig['plotTypes'][plotType]['coloring'];
  var pCLi   = globalConfig['plotTypes'][plotType]['line'];
  /* if subplots: */
  var sPL = globalConfig.plotTypes[plotType]['subplots'];
  if (sPL == true) {
    /* for each sub plot: */
    for (key in globalConfig['axes']['axes_dims']) {
      /* plot index: */
      var pIn = plotIndexes[key];
      /* plot config: */
      var pCDivN = 'plot-' + plotType + '-' + key;
      var pCDiv  = document.getElementById(pCDivN);
      var pCX    = x[plotType][key]['data'];
      var pCXmin = x[plotType][key]['min'];
      var pCXmax = x[plotType][key]['max'];
      var pCXVar = globalConfig['axes']['axes_dims'][key]['x'];
      var pCXTi  = globalConfig['axes']['axes_dims'][pCXVar]['label'];
      var pCXSTi = globalConfig['axes']['axes_dims'][pCXVar]['shortname'];
      var pCY    = y[plotType][key]['data'];
      var pCYmin = y[plotType][key]['min'];
      var pCYmax = y[plotType][key]['max'];
      var pCYVar = globalConfig['axes']['axes_dims'][key]['y'];
      var pCYTi  = globalConfig['axes']['axes_dims'][pCYVar]['label'];
      var pCYSTi = globalConfig['axes']['axes_dims'][pCYVar]['shortname'];
      var pCZmin = plotData[plotType][dataType][key][pIn]['min'];
      var pCZmax = plotData[plotType][dataType][key][pIn]['max'];
      /* mask data? ... check if mask min and max are set: */
      if ((maskData[plotType][dataType][key]['min'] != undefined) &&
          (maskData[plotType][dataType][key]['max'] != undefined)) {
        var pCZ = maskData[plotType][dataType][key]['data'][pIn];
      } else {
        var pCZ = plotData[plotType][dataType][key][pIn]['data'];
      }
      var pCZTi  = globalConfig['axes']['axes_dims'][key]['label'];
      var pCZSTi = globalConfig['axes']['axes_dims'][key]['shortname'];
      var pCDmin = plotData[plotType][dataType][key][pIn]['min'];
      var pCDmax = plotData[plotType][dataType][key][pIn]['max'];
      var pCData = plotData[plotType][dataType][key][pIn]['data'];
      var pCLData = [];
      if (pCZ) {
        for (var dIn = 0; dIn < pCZ.length; dIn++) {
          pCLData[dIn] = [];
          for (var dJn = 0; dJn < pCZ[dIn].length; dJn++) {
            pCLData[dIn][dJn] = pCXSTi + ': ' + pCX[dJn] + '<br>' +
                                pCYSTi + ': ' + pCY[dIn] + '<br>' +
                                pCSNa + ': ' + pCZ[dIn][dJn];
          }
        }
      }
      /* update the plot: */
      var pUpData = {
        'name': pCNa,
        'visible': pCVi,
        'colorscale': [pCCS],
        'showscale': pCSC,
        'contours.coloring': pCClr,
        'colorbar.title': pCCBt,
        'colorbar.titleside': pCCBs,
        'colorbar.nticks': pCCNt,
        'x': [pCX],
        'y': [pCY],
        'z': [pCZ],
        'zmin': pCZmin,
        'zmax': pCZmax,
        'line.width': pCLi,
        'marker.color': [pCData],
        'marker.colorscale': [pCCS],
        'marker.cmin': pCDmin,
        'marker.cmax': pCDmax,
        'marker.showscale': pCSC,
        'marker.size': pCMS,
        'marker.colorbar.title': pCCBt,
        'marker.colorbar.titleside': pCCBs,
        'marker.colorbar.nticks': pCCNt,
        'text': [pCLData]
      }
      var pUpLay = {
        'margin.b': pCMab,
        'margin.t': pCMat,
        'xaxis.range': [pCXmin, pCXmax],
        'xaxis.title': pCXTi,
        'yaxis.range': [pCYmin, pCYmax],
        'yaxis.title': pCYTi
      }
      Plotly.update(pCDiv, pUpData, pUpLay);
      /* if slider: */
      var sEn = globalConfig['plotTypes'][plotType]['slider'];
      if (sEn == true) {
        /* update slider: */
        initSliders();
      }
      /* if mask slider: */
      var msEn = globalConfig['plotTypes'][plotType]['mask'];
      if (msEn == true) {
        /* update slider: */
        initMaskSliders();
      }
    }
  } else {
    /* get plot config: */
    var pCDivN = 'plot-' + plotType;
    var pCDiv  = document.getElementById(pCDivN);
    var pCX    = x[plotType]['data'];
    var pCXmin = x[plotType]['min'];
    var pCXmax = x[plotType]['max'];
    var pCXVar = globalConfig['plotTypes'][plotType]['x'];
    var pCXTi  = globalConfig['axes']['axes_dims'][pCXVar]['label'];
    var pCXSTi = globalConfig['axes']['axes_dims'][pCXVar]['shortname'];
    var pCY    = y[plotType]['data'];
    var pCYmin = y[plotType]['min'];
    var pCYmax = y[plotType]['max'];
    var pCYVar = globalConfig['plotTypes'][plotType]['y'];
    var pCYTi  = globalConfig['axes']['axes_dims'][pCYVar]['label'];
    var pCYSTi = globalConfig['axes']['axes_dims'][pCYVar]['shortname'];
    var pCZ    = z[plotType]['data'];
    var pCZmin = z[plotType]['min'];
    var pCZmax = z[plotType]['max'];
    var pCZVar = globalConfig['plotTypes'][plotType]['z'];
    var pCZTi  = globalConfig['axes']['axes_dims'][pCZVar]['label'];
    var pCZSTi = globalConfig['axes']['axes_dims'][pCZVar]['shortname'];
    var pCDmin = plotData[plotType][dataType]['min'];
    var pCDmax = plotData[plotType][dataType]['max'];
    /* mask data? ... check if mask min and max are set: */
    if ((maskData[plotType][dataType]['min'] != undefined) &&
        (maskData[plotType][dataType]['max'] != undefined)) {
        var pCData = maskData[plotType][dataType]['data'];
        pCX = maskData[plotType][dataType]['x'];
        pCY = maskData[plotType][dataType]['y'];
        pCZ = maskData[plotType][dataType]['z'];
    } else {
      var pCData = plotData[plotType][dataType]['data'];
    }
    var pCLData = [];
    if (pCData) {
      for (var dIn = 0; dIn < pCData.length; dIn++) {
        pCLData[dIn] = pCXSTi + ': ' + pCX[dIn] + '<br>' +
                       pCYSTi + ': ' + pCY[dIn] + '<br>' +
                       pCZSTi + ': ' + pCZ[dIn] + '<br>' +
                       pCSNa + ': ' + pCData[dIn];
      }
    }
    /* update the plot: */
    var pUpData = {
      'name': pCNa,
      'visible': pCVi,
      'colorscale': [pCCS],
      'showscale': pCSC,
      'contours.coloring': pCClr,
      'colorbar.title': pCCBt,
      'colorbar.titleside': pCCBs,
      'colorbar.nticks': pCCNt,
      'x': [pCX],
      'y': [pCY],
      'z': [pCZ],
      'zmin': pCZmin,
      'zmax': pCZmax,
      'line.width': pCLi,
      'marker.color': [pCData],
      'marker.colorscale': [pCCS],
      'marker.cmin': pCDmin,
      'marker.cmax': pCDmax,
      'marker.showscale': pCSC,
      'marker.size': pCMS,
      'marker.colorbar.title': pCCBt,
      'marker.colorbar.titleside': pCCBs,
      'marker.colorbar.nticks': pCCNt,
      'text': [pCLData]
    }
    var pUpLay = {
      'margin.b': pCMab,
      'margin.t': pCMat,
      'xaxis.range': [pCXmin, pCXmax],
      'xaxis.title': pCXTi,
      'yaxis.range': [pCYmin, pCYmax],
      'yaxis.title': pCYTi
    }
    Plotly.update(pCDiv, pUpData, pUpLay);
    /* if slider: */
    var sEn = globalConfig['plotTypes'][plotType]['slider'];
    if (sEn == true) {
      /* update slider: */
      initSliders();
    }
    /* if mask slider: */
    var msEn = globalConfig['plotTypes'][plotType]['mask'];
    if (msEn == true) {
      /* update slider: */
      initMaskSliders();
    }
  }
  /* update layout: */
  updateLayout();
}

/* plot the data: */
function plotNewPlot() {
  /* set inner page title ... : */
  var plTi = globalConfig['dataTypes'][dataType]['title'];
  title000Div.innerHTML = plTi;
  /* get plot config: */
  var pCVi  = globalConfig['dataTypes'][dataType]['visible'];
  var pCCS  = globalConfig['dataTypes'][dataType]['colorscale'];
  var pCSC  = globalConfig['dataTypes'][dataType]['showscale'];
  var pCCBt = globalConfig['dataTypes'][dataType]['cbartitle'];
  var pCCBs = globalConfig['dataTypes'][dataType]['cbarside'];
  var pCCNt = globalConfig['dataTypes'][dataType]['cbarnticks'];
  var pCMS  = globalConfig['dataTypes'][dataType]['marker_size'];
  var pCNa  = globalConfig['dataTypes'][dataType]['label'];
  var pCSNa = globalConfig['dataTypes'][dataType]['shortname'];
  var pCTi  = globalConfig['dataTypes'][dataType]['title'];
  var pCMab = globalConfig['plotTypes'][plotType]['margin_b'];
  var pCMat = globalConfig['plotTypes'][plotType]['margin_t'];
  var pCClr = globalConfig['plotTypes'][plotType]['coloring'];
  var pCLi  = globalConfig['plotTypes'][plotType]['line'];
  var pCIw  = globalConfig['plotTypes'][plotType]['init_plot_width'];
  var pCIh  = globalConfig['plotTypes'][plotType]['init_plot_height'];
  /* if subplots: */
  var sPL = globalConfig['plotTypes'][plotType]['subplots'];
  if (sPL == true) {
    /* for each dimension: */
    for (key in globalConfig['axes']['axes_dims']) {
      /* plot index: */
      var pIn = plotIndexes[key];
      /* plot config: */
      var pCDiv  = 'plot-' + plotType + '-' + key;
      var pCX    = x[plotType][key]['data'];
      var pCXmin = x[plotType][key]['min'];
      var pCXmax = x[plotType][key]['max'];
      var pCXVar = globalConfig['axes']['axes_dims'][key]['x'];
      var pCXTi  = globalConfig['axes']['axes_dims'][pCXVar]['label'];
      var pCXSTi = globalConfig['axes']['axes_dims'][pCXVar]['shortname'];
      var pCY    = y[plotType][key]['data'];
      var pCYmin = y[plotType][key]['min'];
      var pCYmax = y[plotType][key]['max'];
      var pCYVar = globalConfig['axes']['axes_dims'][key]['y'];
      var pCYTi  = globalConfig['axes']['axes_dims'][pCYVar]['label'];
      var pCYSTi = globalConfig['axes']['axes_dims'][pCYVar]['shortname'];
      var pCZmin = plotData[plotType][dataType][key][pIn]['min'];
      var pCZmax = plotData[plotType][dataType][key][pIn]['max'];
      /* mask data? ... check if mask min and max are set: */
      if ((maskData[plotType][dataType][key]['min'] != undefined) &&
          (maskData[plotType][dataType][key]['max'] != undefined)) {
        var pCZ = maskData[plotType][dataType][key]['data'][pIn];
      } else {
        var pCZ = plotData[plotType][dataType][key][pIn]['data'];
      }
      var pCZTi   = globalConfig['axes']['axes_dims'][key]['label'];
      var pCZSTi  = globalConfig['axes']['axes_dims'][key]['shortname'];
      var pCDmin  = plotData[plotType][dataType][key][pIn]['min'];
      var pCDmax  = plotData[plotType][dataType][key][pIn]['max'];
      var pCData  = plotData[plotType][dataType][key][pIn]['data'];
      var pCLData = [];
      if (pCZ) {
        for (var dIn = 0; dIn < pCZ.length; dIn++) {
          pCLData[dIn] = [];
          for (var dJn = 0; dJn < pCZ[dIn].length; dJn++) {
            pCLData[dIn][dJn] = pCXSTi + ': ' + pCX[dJn] + '<br>' +
                                pCYSTi + ': ' + pCX[dIn] + '<br>' +
                                pCSNa + ': ' + pCZ[dIn][dJn];
          }
        }
      }
      /* create new plot: */
      plotCreateNewPlot(pCDiv, pCNa, pCTi, pCCS, pCSC,
                        pCCBt, pCCBs, pCCNt, pCMS, pCVi,
                        pCMab, pCMat, pCIw, pCIh, pCClr, pCLi,
                        pCX, pCXmin, pCXmax, pCXTi,
                        pCY, pCYmin, pCYmax, pCYTi,
                        pCZ, pCZmin, pCZmax, pCZTi,
                        pCDmin, pCDmax, pCData, pCLData);
    }
    /* update layout: */
    updateLayout();
  } else {
    /* plot config: */
    var pCDiv  = 'plot-' + plotType;
    var pCX    = x[plotType]['data'];
    var pCXmin = x[plotType]['min'];
    var pCXmax = x[plotType]['max'];
    var pCXVar = globalConfig['plotTypes'][plotType]['x'];
    var pCXTi  = globalConfig['axes']['axes_dims'][pCXVar]['label'];
    var pCXSTi = globalConfig['axes']['axes_dims'][pCXVar]['shortname'];
    var pCY    = y[plotType]['data'];
    var pCYmin = y[plotType]['min'];
    var pCYmax = y[plotType]['max'];
    var pCYVar = globalConfig['plotTypes'][plotType]['y'];
    var pCYTi  = globalConfig['axes']['axes_dims'][pCYVar]['label'];
    var pCYSTi = globalConfig['axes']['axes_dims'][pCYVar]['shortname'];
    var pCZ    = z[plotType]['data'];
    var pCZmin = z[plotType]['min'];
    var pCZmax = z[plotType]['max'];
    var pCZVar = globalConfig['plotTypes'][plotType]['z'];
    var pCZTi  = globalConfig['axes']['axes_dims'][pCZVar]['label'];
    var pCZSTi = globalConfig['axes']['axes_dims'][pCZVar]['shortname'];
    var pCDmin = plotData[plotType][dataType]['min'];
    var pCDmax = plotData[plotType][dataType]['max'];
    /* mask data? ... check if mask min and max are set: */
    if ((maskData[plotType][dataType]['min'] != undefined) &&
        (maskData[plotType][dataType]['max'] != undefined)) {
      var pCData = maskData[plotType][dataType]['data'];
      pCX = maskData[plotType][dataType]['x'];
      pCY = maskData[plotType][dataType]['y'];
      pCZ = maskData[plotType][dataType]['z'];
    } else {
      var pCData = plotData[plotType][dataType]['data'];
    }
    var pCLData = [];
    if (pCData) {
      for (var dIn = 0; dIn < pCData.length; dIn++) {
        pCLData[dIn] = pCXSTi + ': ' + pCX[dIn] + '<br>' +
                       pCYSTi + ': ' + pCY[dIn] + '<br>' +
                       pCZSTi + ': ' + pCZ[dIn] + '<br>' +
                       pCSNa + ': ' + pCData[dIn];
      }
    }
    /* create new plot: */
    plotCreateNewPlot(pCDiv, pCNa, pCTi, pCCS, pCSC,
                      pCCBt, pCCBs, pCCNt, pCMS, pCVi,
                      pCMab, pCMat, pCIw, pCIh, pCClr, pCLi,
                      pCX, pCXmin, pCXmax, pCXTi,
                      pCY, pCYmin, pCYmax, pCYTi,
                      pCZ, pCZmin, pCZmax, pCZTi,
                      pCDmin, pCDmax, pCData, pCLData);
    /* update layout: */
    updateLayout();
  }
  /* init sliders: */
  initSliders();
  initMaskSliders();
  /* update layout: */
  updateLayout();
}

/* update page layout: */
function updateLayout() {
  /* min / max height as multiple of width: */
  var minWR = globalConfig['plotTypes'][plotType]['min_height_ratio'];
  var maxWR = globalConfig['plotTypes'][plotType]['max_height_ratio'];
  /* container height: */
  container000DivHeight = window.getComputedStyle(container000Div).height;
  var re = new RegExp('px', 'g');
  container000DivHeight = container000DivHeight.replace(re, '');
  /* container width: */
  container000DivWidth = window.getComputedStyle(container000Div).width;
  var re = new RegExp('px', 'g');
  container000DivWidth = container000DivWidth.replace(re, '');
  /* plot container offset: */
  container020DivOffset = container020Div.offsetTop;
  /* plot container height: */
  container020DivHeight = (container000DivHeight - container020DivOffset)*0.99;
  /* mask slider?: */
  var dMS = globalConfig['plotTypes'][plotType]['mask'];
  /* mask slider label?: */
  var mSL = globalConfig['plotTypes'][plotType]['mask_label'];
  /* reset mask slider count: */
  maskSlCount = 0;
  /* if subplots: */
  var sPL = globalConfig['plotTypes'][plotType]['subplots'];
  if (sPL == true) {
    /* check width: */
    var sPMPW = globalConfig['subplot_min_page_width'];
    /* slider?: */
    var sPSL = globalConfig['plotTypes'][plotType]['slider'];
    /* for each dimension / plot: */
    for (var key in globalConfig['axes']['axes_dims']) {
      /* subplot container: */
      var sPCD = document.getElementById('container-' + plotType + '-' + key);
      /* mask slider title element: */
      mTEl = document.getElementById('title-mask-slider-' + plotType + '-' + key);
      /* if less than min width ... : */
      if (container000DivWidth < sPMPW) {
        /* set mask slider title: */
        mTEl.innerHTML = mSL;
        /* set display style + width: */
        sPCD.style['display'] = 'table-row';
        sPCD.style['width']   = '100%';
        sPCDW = container000DivWidth*0.99;
        /* plot container height ... same as width?: */
        sPCDH = container000DivWidth*0.99;
        /* check height is not greater than config ratio: */
        if (sPCDH > (sPCDW * maxWR)) {
          sPCDH = sPCDW * maxWR;
        }
        /* check height is not less than width: */
        if (sPCDH < (sPCDW * minWR)) {
          sPCDH = sPCDW * minWR;
        }
        sPCD.style['height'] = sPCDH.toString() + 'px';
      } else {
        /* set mask slider title: */
        if (maskSlCount < 1) {
          mTEl.innerHTML = mSL;
          maskSlCount++;
        } else {
          mTEl.innerHTML = '&nbsp;';
        }
        /* set display style + width: */
        sPCD.style['display'] = 'table-cell';
        sPCD.style['width']   = '32%';
        sPCDW = (container000DivWidth/3)*0.99;
        /* if slider: */
        if (sPSL == true) {
          /* subplot container offset: */
          sPCDO = sPCD.offsetTop;
          /* plot container height: */
          sPCDH = (container020DivHeight - sPCDO)*0.99;
          /* check height is not greater than config ratio: */
          if (sPCDH > (sPCDW * maxWR)) {
            sPCDH = sPCDW * maxWR;
          }
          /* check height is not less than width: */
          if (sPCDH < (sPCDW * minWR)) {
            sPCDH = sPCDW * minWR;
          }
          sPCD.style['height'] = sPCDH.toString() + 'px';
        } else {
          /* plot container height: */
          sPCDH = container020DivHeight*0.99;
          /* check height is not greater than config ratio: */
          if (sPCDH > (sPCDW * maxWR)) {
            sPCDH = sPCDW * maxWR;
          }
          /* check height is not less than width: */
          if (sPCDH < (sPCDW * minWR)) {
            sPCDH = sPCDW * minWR;
          }
          sPCD.style['height'] = sPCDH.toString() + 'px';
        }
      }
      /* update plots, if possible: */
      var pD = document.getElementById('plot-' + plotType + '-' + key);
      if (pD.data) {
        var pDUL = {
          'height': sPCDH,
          'width':  sPCDW
        }
        Plotly.relayout(pD, pDUL);
      }
    }
  } else {
    /* mask slider title element: */
    mTEl = document.getElementById('title-mask-slider-' + plotType);
    /* set mask slider title: */
    mTEl.innerHTML = mSL;
    /* just one plot ... plot container: */
    var pCD = document.getElementById('container-' + plotType);
    /* set display style + width: */
    pCD.style['display'] = 'table-row';
    pCD.style['width']   = '100%';
    /* plot container width: */
    pCDW = container000DivWidth*0.85;
    /* plot container height: */
    pCDH = container020DivHeight*0.99;
    /* check height is not greater than config ratio: */
    if (pCDH > (pCDW * maxWR)) {
      pCDH = pCDW * maxWR;
    }
    /* check height is not less than width: */
    if (pCDH < (pCDW * minWR)) {
      pCDH = pCDW * minWR;
    }
    pCD.style['height'] = pCDH.toString() + 'px';
    var pD = document.getElementById('plot-' + plotType);
    if (pD.data) {
      var pDUL = {
        'height': pCDH,
        'width':  pCDW
      }
      Plotly.relayout(pD, pDUL);
    }
  }
}

/* set up the page: */
function loadPage() {
  initVariables();
  initButtons();
  updateButtons();
  initPlotDivs();
  updateLayout();
  /* ensure first plot is always a new plot: */
  var pT = plotType;
  plotType = '';
  startPlot(pT, dataType);
}

/** add listeners: **/

/* on page load: */
window.addEventListener('load', function() {
  /* load the page ... : */
  loadPage();
});

/* on page resize: */
window.addEventListener('resize', function() {
  /* update the layout: */
  updateLayout();
});

