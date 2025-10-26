library(tidyverse)

data_as_row = function(fname) {
    csv = read_csv(fname)
    csv = apply(csv, 2, mean, na.rm=TRUE)
    csv
}

benchmarks = tibble(
    compression=c("none", "zlib", "brotli", "brotli*"),
    dplyr::bind_rows(
        data_as_row("uncompressed.csv"),
        data_as_row("zlib.csv"),
        data_as_row("brotli.csv"),
        data_as_row("brotli_fast.csv")
    )
)
benchmarks$`total (cache hit)` = benchmarks$decompress + benchmarks$deserialize
benchmarks$`total (cache miss)` = benchmarks$`total (cache hit)` + benchmarks$receive
benchmarks = benchmarks |> mutate_if(is.numeric, round, digits=3)
write_csv(benchmarks, "merged_compression_benchmarks.csv")