let trendChart; // Store the Chart.js instance
let trendData = {
    labels: [], // Time (Year/Month/Day)
    datasets: [{
        label: "Trendiness Score",
        data: [], // Trendiness score values
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4
    }]
};

// Function to fetch real-time trendiness score (simulate API call)
function fetchRealTimeData() {
    // Replace with actual API call logic to fetch data
    const currentTime = new Date().toLocaleTimeString(); // Simulated time (you can replace it with date)
    const randomTrendScore = Math.floor(Math.random() * 100); // Simulated data for demo purposes

    // Update trendData with new data
    trendData.labels.push(currentTime);
    trendData.datasets[0].data.push(randomTrendScore);

    if (trendData.labels.length > 10) {
        trendData.labels.shift(); // Keep the last 10 entries
        trendData.datasets[0].data.shift(); // Remove the oldest data
    }

    // Update chart with the new data
    updateChart(trendData);
}

// Function to update the chart with new data
function updateChart(data) {
    const ctx = document.getElementById("trendChart").getContext("2d");

    if (trendChart) {
        trendChart.data = data; // Update the data in the existing chart
        trendChart.update(); // Update the existing chart with the new data
    } else {
        // Create the chart if it doesn't exist yet
        trendChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Trendiness Score'
                        },
                        min: 0,
                        max: 100
                    }
                }
        }});
    }
}

// Function to start real-time chart updates
function startRealTimeChart() {
    // Fetch data every 10 seconds (3000 milliseconds)
    setInterval(fetchRealTimeData, 10000);
}

// Start the real-time chart updates
startRealTimeChart();

// Function to check trendiness of a word across Reddit
function checkTrendiness() {
    const wordInput = document.getElementById("word-input").value.trim().toLowerCase();
    const trendScoreEl = document.getElementById("trend-score");
    const platformsEl = document.getElementById("platforms");

    if (!wordInput) {
        trendScoreEl.innerText = "Please enter a word/phrase";
        platformsEl.innerText = "N/A";
        return;
    }

    trendScoreEl.innerText = "Analyzing...";
    platformsEl.innerText = "Checking...";

    // Search Reddit for the term
    fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(wordInput)}&limit=5`)
    .then(response => response.json())
    .then(data => {
        console.log(data); // Add this to check the response
        const posts = data.data.children;
        const score = calculateTrendScore(posts);
        const activeSubreddits = [...new Set(posts.map(p => p.data.subreddit))];

        trendScoreEl.innerText = `${score}%`;
        platformsEl.innerText = activeSubreddits.join(', ');

        updateTrendingWords(posts);
    })
    .catch(error => {
        console.error("Search failed:", error);
        trendScoreEl.innerText = "Error";
        platformsEl.innerText = "API failed";
    });

    // Simulating data for the trend chart (replace with actual data if possible)
    fetchTrendData(wordInput);
}

// Simulate Trend Data for Chart
function fetchTrendData(word) {
    // Simulated data for trend analysis (Replace with actual API data)
    const trendData = {
        labels: ["2023", "2022", "2021"], // Years
        datasets: [{
            label: `Trendiness of "${word}"`,
            data: [80, 60, 75], // Example trend scores
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.4
        }]
    };

    // Update chart with the fetched data
    updateChart(trendData);
}

// Calculate Trendiness Score
function calculateTrendScore(posts) {
    if (!posts.length) return 0;

    const totalUpvotes = posts.reduce((sum, post) => sum + post.data.ups, 0);
    const avgUpvotes = totalUpvotes / posts.length;

    return Math.min(100, Math.round(avgUpvotes / 1000 * 100));
}

// Update Trending Words List
function updateTrendingWords(posts) {
    const trendingList = document.getElementById("trending-list");
    trendingList.innerHTML = "";

    if (!posts || !posts.length) {
        trendingList.innerHTML = `<li>No trending topics found</li>`;
        return;
    }

    posts.forEach(post => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="upvotes">▲ ${post.data.ups}</span>
            <a href="https://reddit.com${post.data.permalink}" target="_blank">
                ${post.data.title}
            </a>
            <span class="subreddit">r/${post.data.subreddit}</span>
        `;
        trendingList.appendChild(li);
    });
}
