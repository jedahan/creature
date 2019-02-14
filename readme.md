# creature

digital, peer-to-peer, creature

people help it move

## design

### the home

a place that others can be invited to

a raspberry pi 3 running scuttlebutt, which people can become friends with

### the creature

a living thing that likes being shuttled from person to person

a raspberry pi zero running a custom scuttlebutt client, sharing its heartbeat and dna

a button to interact with the creature, changing its heartbeat and dna


### their relationship

people interact with the creature by pressing the button

the button changes the creatures heartbeat

the heartbeat is shared with the home

anyone who is invited into the home sees the new heartbeat, and new dna

## creating a home

Gather the following materials

* computer with [Docker](https://www.docker.com/get-started) installed
* microSD card + microSD adapter
* raspberry pi 3
* copy of this repository

We use Docker to create and customize `home.raspbian.img`, which will be etched onto a microSD card for the Raspberry Pi. This lets us create and customize new homes from our computers instead of directly on the pi.

Start by [installing docker](https://www.docker.com/get-started) for your platform.

Next, open up a terminal, and clone this repository somewhere


    git clone https://github.com/jedahan/creature && cd creature

Now we are ready to create an home! It make take up to an hour to build everything.

    make home.raspbian.img

Once the home image is built, we can etch it onto a microSD card.

Install [etcher](https://etcher.io/) (or etcher-cli) and point it to the image:

    sudo etcher home.raspbian.img

Put the microSD card into a raspberry pi, turn it on, and after a minute or two you should see a 'home' wifi network up.

## creating a creature

Follow the same steps as above, but replace `home` with `creature`

## making friends

The creature and home need to be 'friends' in scuttlebutt-speak for them to share information.

## technical diagram

wireless diagram

* creature => 'creature' wifi ssid <=> home <=> 'home' wifi <= people's cell phones

hardware diagram

* button <= rpi zero <= wifi => rpi 3 <= ethernet => ubiquiti <= wifi => cellphones

software diagram

* scuttlebutt-heartbeat => scuttlebot local => scuttlebutt network
* scuttlebutt network => home webapp => cell phone browser

interaction diagram

nodes press button => heartbeat updates locally => scuttlebutt shares new heartbeat to network => scuttlebutt scuttles (shares with friends and friends of friends of home)

