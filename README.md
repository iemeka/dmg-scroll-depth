# Depth Tracking System

Please find below the implementation of a scroll depth tracking system designed to monitor and inform users of their progress through an article on a webpage. This system supports both fixed content and dynamically loaded content.

### Versions Implemented
Article Only: This version tracks the scroll depth through the article up to the start of the comment section. It provides a progress bar and notifications to inform the user of their current progress

Article + Infinite Feed: This version extends tracking to cover the entire page, including infinite scrolling feeds. It ensures that the progress bar and notifications remain accurate even with dynamically loaded content.

### Optimization
Mutation Observer: I identified that some content is loaded dynamically, which prompted the use of a Mutation Observer to handle content changes and maintain accurate scroll tracking.

Debouncing: The scrollProgress function is debounced to reduce the frequency of updates, thus improving performance by avoiding excessive processing during rapid scrolling.

Throttling: Used on the Mutation Observer to improve performance by controlling how frequently it handles updates. This prevents excessive processing when content changes rapidly.

### User Interface
Progress Bar: Displays the scroll depth as a percentage with a colour-coded bar that changes at specific thresholds (25%, 50%, 100%).

Notifications: At each offset, an event is dispatched which triggers the display of a notification with a brief display time of 1 second.

### Testing
It was tested on Google Chrome and Mozilla Firefox;

Testing Method:

Console Testing: The code was tested by pasting it directly into the browser console to simulate user interaction and observe the system’s behavior.

Chrome Extension: I built a Chrome extension to help me inject and load the script asynchronously on the page
