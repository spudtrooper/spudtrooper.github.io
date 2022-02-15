# seats

[github.com/spudtrooper/seats](https://github.com/spudtrooper/seats) is a tool to search across various ticket sites (e.g. vividseats, stubhub, seatgeek) for a single event. I used it at first to search at a given point in time for how ticket prices for a particular seat varied ([example](./Knicks-Kings.html)); then how all the tickets varied over time ([example](knicks_kings/)). Both of these examples are from the Knick/Kings game on Jan 24 at 7:30pm EST, e.g.

![ss](./knicks_kings.png)

See people [dump superbowl tickets](https://spudtrooper.github.io/seats/super_bowl_lvi/?lastDay) on the last day.

I went to the Knick/Pelicans game on Jan 20 at the last minute and noticed that the price for some floor tickets had dropped dramatically, and I was wondering whether this was a fluke or the norm. It appears like this maybe, kind of, sort of is the norm? I don't know?

Conslusions???:

- You can see all the tickets whose prices changed in the [last day](knicks_kings/?lastDay) and in the [last 2 hours](knicks_kings/?lastMinute). Maybe there are patterns?
- You could probably also use this data to identify the big ticket brokers, since they probably move ticket prices similarly across sites and similarly across times.
