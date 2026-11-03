---
role: "Developer (personal project)"
timeframe: "2021–2022, revisited in 2026"
outcome: "A web tool that turns a lab plate reading into a fitted calibration curve. Two versions are live: the original Vue app and a rewrite in Nuxt with Vuex."
---

## The problem

In biology lab assays it's common to find a property of a sample by interpolation. A signal (absorbance, fluorescence, radiation, electrical resistance, temperature) is measured for a set of standards of known concentration, which gives a **calibration curve**. The unknown sample's value is then read off that curve.

When I started Calliv I was studying biotechnology and wanted to work with AI in the biological sciences. This project brings the two together: a real lab workflow, solved with machine-learning tooling.

## What it does

Calliv takes the CSV a plate reader exports and runs the whole process in the browser:

1. **Reads** the file, with `;` separators and decimal commas, exactly as the instrument exports it.
2. **Organizes** the readings: subtracts the background from each one, averages the repeated readings of each well and lays out the plate matrix.
3. **Subtracts the blank** and clamps anything below it to zero.
4. **Plots** the standards so outliers stand out.
5. **Fits** a regression and shows the curve's equation.

The sample CSV in both repositories is a real plate read: 32 wells (`A1`–`H4`), each read over 3 cycles.

## Version 1: a Vue app

The first version (2021) is a Vue 2 app that runs entirely in the browser:

- **TensorFlow.js** fits the models by gradient descent, and **p5.js** draws the points and the curve.
- It fits a **line or a parabola** and shows the <span tabindex="0" data-bs-toggle="tooltip" data-bs-placement="top" title="Coefficient of determination: the share of the variation in the data that the curve explains. 1 is a perfect fit.">R²</span> of each.
- Each screen saves its results to `localStorage`, and the next one reads them back.

It worked, but with clear limits: the standards' values were hardcoded, and unless you went through the processing screen, the curve screen had nothing to fit.

## Version 2: the Nuxt rewrite

In May 2021 I started over in NuxtJS, applying what I had learned. The main changes:

- **A Vuex store** instead of scattered `localStorage` keys. One store holds all the data and is saved whole by a plugin. Each calculation step is a named mutation, and one action chains the full processing when the file is uploaded.
- **Editable standards:** each plate row has its own input for the standard's concentration.
- **Two ways to fit the line:** gradient descent with TensorFlow.js, with a configurable learning rate and number of iterations, or **least squares**, the exact formula. TensorFlow only loads when it's used.
- **Highcharts** for the charts.

Comparing the two methods taught me the most. For a line, least squares always gives the same exact result. Gradient descent starts from random values, converges slowly on this data and diverges once the learning rate passes a certain point. It was a good lesson in when an iterative model is the wrong tool.

## The 2026 revisit

In 2026 I came back to the project to make both versions usable again:

- Split each version into its own repository and updated them to run on current tooling (pnpm and a recent Node).
- Documented the CSV format and how each screen works, with a walkthrough using the sample data.
- Deployed both to Cloudflare Workers as static sites.

## What's still missing

- **Interpolating the unknown sample**, the last step of the assay. Both versions stop at fitting the curve.
- Version 2 only fits lines, and the standards have to be in the plate's first column.

## What I learned

- Moving a Vue single-page app to NuxtJS: file-based routing, plugins and static generation.
- Managing shared state with Vuex, and why it beats passing data between screens by hand.
- Fitting regression models with TensorFlow.js, and knowing when an exact formula is the better choice.
- Handling multidimensional arrays to represent a lab plate.

**Try it:** [version 1](https://calliv-v1.iasisalomon.workers.dev/) · [version 2](https://calliv-v2.iasisalomon.workers.dev/)

**Source:** [calliv-v1](https://github.com/iasisalomon/calliv-v1) · [calliv-v2](https://github.com/iasisalomon/calliv-v2)
