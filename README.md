### Results

The `test/` directory includes 500 test images we ran our classification model over to achieve
a mean average precision of 0.9276 (in the ballpark of the top 200 Kaggle classifiers). Our
predictions are available in `test/final.csv`. These results are also available in a
[Google Sheet](https://docs.google.com/spreadsheets/d/10eBGe7o13mBcyP4nCERfbhV3LIHQwpDCfC0gwqB8VBw/edit#gid=0)
for members of the Columbia community.

### Downloading 28x28 grayscale images from GCP

```
# Requires python3, pip3
pip3 install -r requirements.txt
./scripts/fetch_grayscale_images.py
```

### Preparing CSVs to upload to AutoML

```
./scripts/generate_automl_vision_csv.py <class> <count> > output.csv
```

### Preparing test images

The ndjson test images from Kaggle's competition have been transformed into 28x28
grayscale images matching the training ones available from [Google Cloud Console](https://console.cloud.google.com/storage/quickdraw_dataset/).
They are available in the `./data/images.tar.gz` archive.

### Making predictions (requires setting GOOGLE_APPLICATION_CREDENTIALS to the private GCP project)

```
npm install

// Run all images in the ./images folder through the 340 binary classifiers
node ./scripts/predict.js

// Run all images in the ./images folder through a specific classifier
node ./scripts/predict2.js <automl model id> <output filename>
```

### Data augmentation

The included IPython notebooks in `ipynb/` contain routines for training GANs and applying image-based transformations to rasterized, 28x28 grayscale images from the quickdraw dataset.
