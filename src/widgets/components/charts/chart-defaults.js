export default {
  bar: {
    layout:{
      autosize: true,
      hovermode: 'closest',
      hoverlabel: { align: 'left', bgcolor: 'fff' },
      colorway: ['#0062d9', '#f65b20', '#ffaa00', '#dd196b', '#9928b3', '#00b5c8', '#a8a8a8'],
      yaxis: {
        // visible: !islongTickLabel('y'),
        title: {
          // text: getTitle('y'),
          text: 'y',
          standoff: 5
          // standoff: isVertical ? 5 : 20
        },
        automargin: true,
        ticklen: 8,
        showline: true,
      },
      xaxis: {
        // visible: !islongTickLabel('x'),
        title: {
          // text: getTitle('x'),
          text: 'x',
          standoff: 20
          // standoff: isVertical ? 5 : 20
        },
        automargin: true,
        // tickangle: islongTickLabel('x') ? 45 : 0,
        tickangle: 0,
        ticklen: 8,
      },
      // ...( config.data?.length > 1 ? { barmode: groupMode } : {}),
    },
    useResizeHandler: true,
  },
  line: {
    layout:{
      // showlegend: multiAxis ? false : true,
      showlegend: false,
      autosize: true,
      hovermode: 'closest',
      hoverlabel: { align: 'left', bgcolor: 'fff' },
      colorway: ['#0062d9', '#f65b20', '#ffaa00', '#dd196b', '#9928b3', '#00b5c8', '#a8a8a8'],
      yaxis: {
        title: {
          // text: isJson || multiAxis ? yAxis[0] : 'value',
          text: 'value',
          standoff: 20,
        },
        automargin: true,
        showline: true,
      },
      xaxis: {
        title: {
          // text: isJson || xAxis,
          standoff: 20
        },
        automargin: true,
        // tickangle: islongTickLabel ? 45 : 0,
        tickangle: 0,
        rangemode: 'tozero'
      },
      // ...(multiAxis && { yaxis2: {
      //   overlaying: 'y',
      //   side: 'right',
      //   title: yAxis[1],
      //   automargin: true,
      //   type: 'linear',
      //   showline: true,
      // } })
    },
  }, 
  pie: {
    layout: {
      colorway: ['#0062d9', '#f65b20', '#ffaa00', '#dd196b', '#9928b3', '#00b5c8', '#a8a8a8'],
      autosize: true,
      hoverlabel: { align: 'left', bgcolor: 'fff' },
      // ...multi,
    },
  }
}