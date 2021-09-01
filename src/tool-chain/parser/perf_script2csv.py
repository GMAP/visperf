import argparse
import perf_record_helper as perf_record


parser = argparse.ArgumentParser(description="Parse perf data.")
parser.add_argument(
    "-i",
    "--input",
    type=str,
    help="TXT file generated with `perf script`.",
    required=True,
)
args = vars(parser.parse_args())


if __name__ == "__main__":
    csv_path = args["input"].replace(".txt", ".csv")
    perf_record.parse_record_dataset(args["input"], csv_path)
    print(f"Parsed file {args['input']}.")
