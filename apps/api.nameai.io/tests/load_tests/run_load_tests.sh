#!/bin/bash

user_counts=(16 32 64 128 256)
output_file="latency_results.csv"
echo "users,requests,failures,mean_latency,median_latency,p95_latency" > $output_file

for n_users in "${user_counts[@]}"
do
    echo "Running test with $n_users users..."
    
    # run locust with specified number of users (--spawn-rate is set to n_users/10 for gradual ramp-up)
    locust -f performance.py \
           --headless \
           --users $n_users \
           --spawn-rate $(($n_users/10)) \
           --run-time 1m \
           --host "http://localhost:8000" \
           --only-summary \
           --csv="stats_$n_users"

    # extract metrics from the csv file ("Aggregated" row)
    stats=$(tail -n 1 "stats_${n_users}_stats.csv")

    # extract relevant columns
    echo "$stats" | awk -F',' '{print "'$n_users'," $3 "," $4 "," $6 "," $5 "," $16}' >> $output_file
    
    # clean up all temporary files
    rm -f "stats_${n_users}_stats.csv" \
          "stats_${n_users}_stats_history.csv" \
          "stats_${n_users}_failures.csv" \
          "stats_${n_users}_exceptions.csv"
    
    # wait between tests to let system stabilize
    sleep 5
done

echo "Testing complete. Results saved to $output_file"
