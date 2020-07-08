
/*
   define plots and data sets.
*/

var globalConfig = {
  'page_title':             'Volcanic Forcing Online Tool',
  'plot_button_label':      'Plot type',
  'data_button_label':      'Model output',
  'default_plot_type':      'scatter3d',
  'default_data_type':      'axes',
  'data_directory':         'data',
  'init_plot_width':        250,
  'init_plot_height':       250,
  'subplot_min_page_width': 800,
  'plotTypes': {
    'scatter3d': {
      'name':             'scatter3d', 
      'label':            '3D scatter', 
      'subplots':         false,
      'slider':           false,
      'mask':             true,
      'mask_label':       'Constrain parameter space',
      'margin_b':         30,
      'margin_t':         30,
      'coloring':         'none',
      'line':             0,
      'min_height_ratio': 0.5,
      'max_height_ratio': 0.9,
      'x':                'so2',
      'y':                'lat',
      'z':                'injection_height'
    },
    'contour': {
      'name':             'contour', 
      'label':            'contour', 
      'subplots':         true,
      'slider':           true,
      'mask':             true,
      'mask_label':       'Constrain parameter space',
      'margin_b':         45,
      'margin_t':         30,
      'coloring':         'fill',
      'line':             1,
      'min_height_ratio': 0.7,
      'max_height_ratio': 0.8
    }
  },
  'axes': {
    'axes_dims': {
      'injection_height': {
        'name':        'injection_height',
        'label':       'Injection height (km)',
        'shortname':   'height',
        'length':      26,
        'x':           'so2',
        'y':           'lat',
        'offset_mult': 676,
        'offset_add':  0,
        'x_inc':       1,
        'y_inc':       0
      },
      'lat': {
        'name':        'lat',
        'label':       'Latitude',
        'shortname':   'lat',
        'length':      26,
        'x':           'so2',
        'y':           'injection_height',
        'offset_mult': 26,
        'offset_add':  0,
        'x_inc':       1,
        'y_inc':       650
      },
      'so2': {
        'name':        'so2',
        'label':       'SO₂ emission (Tg)',
        'shortname':   'SO₂',
        'length':      26,
        'x':           'lat',
        'y':           'injection_height',
        'offset_mult': 1,
        'offset_add':  0,
        'x_inc':       26,
        'y_inc':       0
      }
    }
  },
  'dataTypes': {
    'axes': {
      'name':          'axes',
      'label':         'axes',
      'shortname':     'axes',
      'sel_visible':   false,
      'slider_enable': false,
      'mask_enable':   false,
      'mask_label':    'axes',
      'visible':       false,
      'colorscale':    'Greys',
      'showscale':     false,
      'cbartitle':     '',
      'cbarside':      'right',
      'cbarnticks':    8,
      'marker_size':   0,
      'title':         '&nbsp;',
      'axes_data':     'axes_2dp_17576.bin',
      'plot_data':     'null_17576.bin'
    },
    'efolding': {
      'name':          'efolding',
      'label':         'e-folding time',
      'shortname':     'e-folding',
      'sel_visible':   true,
      'slider_enable': true,
      'mask_enable':   true,
      'mask_values':   20,
      'mask_min_step': 3,
      'mask_label':    'e-folding time (months)',
      'visible':       true,
      'colorscale':    [
        [0,'rgb(255,255,255)'],
        [0.3,'rgb(255,210,0)'],
        [0.6,'rgb(230,0,0)'],
        [1,'rgb(0,0,0)']
      ],
      'showscale':     true,
      'cbartitle':     'months',
      'cbarside':      'right',
      'cbarnticks':    8,
      'marker_size':   8,
      'title':         'Average global sulfate e-folding decay time',
      'axes_data':     'axes_2dp_17576.bin',
      'plot_data':     'efolding_2dp_17576.bin'
    },
    'saod': {
      'name':          'saod',
      'label':         'sAOD',
      'shortname':     'sAOD',
      'sel_visible':   true,
      'slider_enable': true,
      'mask_enable':   true,
      'mask_values':   20,
      'mask_min_step': 3,
      'mask_label':    'sAOD (months)',
      'visible':       true,
      'colorscale':    [
        [0,'rgb(255,255,255)'],
        [0.3,'rgb(255,210,0)'],
        [0.6,'rgb(230,0,0)'],
        [1,'rgb(0,0,0)']
      ],
      'showscale':     true,
      'cbartitle':     'months',
      'cbarside':      'right',
      'cbarnticks':    8,
      'marker_size':   8,
      'title':         'Time-integrated global mean sAOD (550 nm)',
      'axes_data':     'axes_2dp_17576.bin',
      'plot_data':     'saod_2dp_17576.bin'
    },
    'forcing': {
      'name':           'forcing',
      'label':          'net forcing',
      'shortname':      'forcing',
      'data_max_value': 0,
      'sel_visible':    true,
      'slider_enable':  true,
      'mask_enable':    true,
      'mask_values':    20,
      'mask_min_step':  3,
      'mask_label':     'net forcing (MJ m⁻²)',
      'visible':        true,
      'colorscale':    [
        [0,'rgb(0,0,0)'],
        [0.3,'rgb(230,0,0)'],
        [0.6,'rgb(255,210,0)'],
        [1,'rgb(255,255,255)']
      ],
      'showscale':      true,
      'cbartitle':      'MJ m⁻²',
      'cbarside':       'right',
      'cbarnticks':     8,
      'marker_size':    8,
      'title':          'Time-integrated global mean net radiative forcing',
      'axes_data':      'axes_2dp_17576.bin',
      'plot_data':      'forcing_2dp_17576.bin'
    }
  }
}

