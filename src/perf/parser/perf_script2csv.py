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
parser.add_argument(
    "-t",
    "--thread-ids",
    type=str,
    help="TXT file with thread ids to filter perf captures.",
    required=False,
)
args = vars(parser.parse_args())


def read_thread_ids(tid_file):
    if not tid_file:
        return []
    with open(tid_file, "r") as f:
        tids = [x.replace("\n", "") for x in f.readlines()]
        return tids


if __name__ == "__main__":
    csv_path = args["input"].replace(".txt", ".csv")
    perf_record.parse_record_dataset(
        args["input"], csv_path, read_thread_ids(args.get("thread_ids", None))
    )
    print(f"Parsed file {args['input']}.")
