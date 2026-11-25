---
title: CalcRoad
summary: Modelling where water collects on a road and where drainage is needed.
kind: Advanced Calculus project at Plaksha
order: 3
cover: road
topics: [Multivariable calculus, Python, Data visualisation]
repository: https://github.com/OrbitBoom/CalcRoad
---
How could a road drain while keeping its existing shape? For an Advanced Calculus project at Plaksha, I modelled a road that dips along its length and slopes down from its centre towards its gutters.

## The elevation model

<math display="block" aria-label="z of x and y equals 0.00025 x squared plus 0.07 times the quantity one minus y squared over 12.25">
  <mi>z</mi><mo>(</mo><mi>x</mi><mo>,</mo><mi>y</mi><mo>)</mo><mo>=</mo>
  <mn>0.00025</mn><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><mn>0.07</mn>
  <mo>(</mo><mn>1</mn><mo>−</mo><mfrac><msup><mi>y</mi><mn>2</mn></msup><mn>12.25</mn></mfrac><mo>)</mo>
</math>

Here *x* runs along the road, *y* runs across it and *z* is the elevation, all in metres. The model covers a 40 m length and a 7 m width.

I used Python to visualise the surface and the flooded regions at a chosen water level. The vertical scale in the illustration is exaggerated so that the changes in elevation are visible.
