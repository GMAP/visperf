import csv


def parse_event(l):
    return l.replace(":", "")


def parse_counter(l):
    return int(l)


def parse_time(l):
    return float(l.replace(":", ""))


def parse_cpu(l):
    return l.replace("[", "").replace("]", "")


def parse_info_line(line):
    l = line.split()
    return [parse_time(l[3]), parse_event(l[5]), parse_counter(l[4]), parse_cpu(l[2])]


def parse_stack_function(l):
    return l


def parse_stack_line(line):
    l = line.split()
    return [parse_stack_function(l[1])]


def parse_lines(lines):
    l = parse_info_line(lines[0])
    stack_functions = []
    for i in range(1, len(lines)):
        stack_functions.append(parse_stack_line(lines[i])[0])
    l.append("|".join(stack_functions))
    return l


def parse_record_dataset(file, csv_output):
    with open(file, "r") as f:
        with open(csv_output, "w") as csv_file:
            csv_writer = csv.writer(
                csv_file, delimiter=",", quotechar='"', quoting=csv.QUOTE_ALL
            )
            csv_writer.writerow(["time", "event", "counter", "cpu", "stack"])
            lines = []
            for line in f:
                if not line.strip():
                    l = parse_lines(lines)
                    csv_writer.writerow(l)
                    lines = []
                else:
                    lines.append(line)
