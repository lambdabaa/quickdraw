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
