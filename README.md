# Spiral Heat Maps

R bindings for a D3 visualization inspired by:

https://bl.ocks.org/tomshanley/0a024581fd0b7c4e483203d5bff9631b

## Dependencies

* d3v3
* c3

* tidyverse
* htmlwidgets

## Installation
```
devtools::install_github("hbnordin2/spiralHeatMaps")
```

## Example

```
library(tidyverse)
library(spiralHeatMaps)

pump <- read_csv("name,value
A,.08167
B,.01492
C,.02782
D,.04253
E,.12702
F,.02288
G,.02015
H,.06094
I,.06966
J,.00153
K,.00772
L,.04025
M,.02406
N,.06749
O,.07507
P,.01929
Q,.00095
R,.05987
S,.06327
T,.09056
U,.02758
V,.00978
W,.02360
X,.00150
Y,.01974
Z,.00074")

spiralHeatMap(pump)
```
