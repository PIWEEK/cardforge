# Cardforge | Penpot Plugin

![](https://raw.githubusercontent.com/PIWEEK/cardforge/d25f9f0d062c040b668a82ac0256192b5ad3080e/public/images/main-logo.svg)

## Introduction

The Cardforge plugin for [Penpot](penpot.app) allows you to create decks for board games. You only have to design the front and the back of a card, create a list of all the cards that you want, and the plugin will generate an output to print the cards or even use on digital game systems.

## Installation

To install the component, just open the plugin manager in Penpot and paste this URL: https://cardforge-dn5.pages.dev/assets/manifest.json

## Usage

### Create a new Deck

Go to an empty page. Open the plugin. Choose a name for the deck, select a size and orientation, and click "Create Deck."

![](https://github.com/PIWEEK/cardforge/blob/main/screenshots/create_deck.jpg?raw=true)

The plugin will set the name of the page and create frames for the front and back of the card.

These frames have a bleed area (see further on) and a border. Feel free to modify them according to your needs.

### Design a base card

Design a card within the Front frame as you wish, but do not change the size or the name of the frame.

Add image and text layers for the sections of the card that will differ on each card. These variable layers must have a unique name and start with the character #. For example, #name, #background, #image, #power...

Design the back of the cards within the Back frame, but do not change the size or the name of the frame either. The back cannot have variable fields.

![](https://github.com/PIWEEK/cardforge/blob/main/screenshots/design.jpg?raw=true)


### Cards list

Here you will find a list of all the cards in your deck. Click "Add Card" to create a new card.

For each card, you can assign values to the text or image variable fields.

![](https://github.com/PIWEEK/cardforge/blob/main/screenshots/cards.jpg?raw=true)

You can also duplicate or delete a card.

When all the cards are ready, press "Forge Cards" to create them.


### Forging cards

![](https://github.com/PIWEEK/cardforge/blob/main/screenshots/forge.jpg?raw=true)

You can create your cards in three different ways

**Standard**: This method is for printing at a print shop. They typically require a separate file for each card, so this option generates a list of all the cards to export each one individually.

**Print and Play**: This method is for printing the cards on a regular printer. It will arrange your cards on A4 pages, which you can export and print individually. It also set the front and back of each card together, so you can fold them along the joint to assemble the physical cards.

**Tabletop**: This method creates a single frame containing all the cards arranged in a 10x7 grid, with the back positioned in the bottom right corner. This format is used by Tabletop Simulator and similar software.


For both Standard and Print and Play, you can also choose to include cut marks to assist you (or the print shop) in cutting the cards.

### Sample result

![](https://github.com/PIWEEK/cardforge/blob/main/screenshots/export.jpg?raw=true)


### Bleeding area and margins

![](https://raw.githubusercontent.com/PIWEEK/cardforge/refs/heads/main/public/images/print_info.png)



## Feedback and Support

Please open an [issue](https://github.com/PIWEEK/cardforge/issues) either to provide feedback or to share a bug.
