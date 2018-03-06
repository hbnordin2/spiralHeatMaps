#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
polarBarChart <- function(message, width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  x = jsonlite::toJSON(message)

  # create widget
  htmlwidgets::createWidget(
    name = 'polarBarChart',
    x, # All data passed into widget
    width = width,
    height = height,
    package = 'spiralHeatMaps',
    elementId = elementId
  )
}

#' Shiny bindings for polarBarChart
#'
#' Output and render functions for using polarBarChart within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a polarBarChart
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name polarBarChart-shiny
#'
#' @export
polarBarChartOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'polarBarChart', width, height, package = 'spiralHeatMaps')
}

#' @rdname polarBarChart-shiny
#' @export
renderSpiralHeatMap <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, polarBarChartOutput, env, quoted = TRUE)
}
