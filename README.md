### Downloading 28x28 grayscale images from GCP

```
# Requires python3, pip3
pip3 install -r requirements.txt
./fetch_grayscale_images.py
```

### Preparing CSVs to upload to AutoML

```
./generate_automl_vision_csv.py <class> <count> > output.csv
```

### Making predictions (requires setting GOOGLE_APPLICATION_CREDENTIALS to the private GCP project)

```
npm install

// Run all images in the ./images folder through the 340 binary classifiers
node predict.js

// Run all images in the ./images folder through a specific classifier
node predict2.js <automl model id> <output filename>
```

### Data augmentation

The included IPython notebooks contain routines for training GANs and applying image-based transformations to rasterized, 28x28 grayscale images from the quickdraw dataset.
