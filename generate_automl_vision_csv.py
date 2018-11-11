#!/usr/bin/env python

import random
import sys

BUCKET = 'gs://coms-w4995-vcm'

"""
Script to create an input csv for AutoML vision for a single object class.

Usage: python generate_automl_vision_csv.py <class> <number of class examples>
"""

def format_csv_line(bucket, category, id, label):
	return '"%s/%s/%d.jpg",%s' % (bucket, category, id, label)

def main():
	target = sys.argv[1]
	count = int(sys.argv[2])
	result = []
	for idx in range(0, count):
		# Add all of the positive examples.
		result.append(format_csv_line(BUCKET, target, idx, '1'))
		with open('./buckets.txt', 'r') as buckets_file:
			buckets = list(map(
				lambda x: x.rstrip('\n'),
				buckets_file.readlines()))
			others = list(map(
				lambda x: x.split('/')[-2],
				filter(lambda x: target not in x,  buckets)))
			for other in others:
				for idx in range(0, count / len(others)):
					result.append(format_csv_line(BUCKET, other, idx, '0'))
	random.shuffle(result)
	for x in result:
		print(x)

if __name__ == '__main__':
	main()
