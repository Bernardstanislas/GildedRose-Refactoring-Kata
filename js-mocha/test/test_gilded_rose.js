var {expect} = require('chai');
var {Shop, Item, ItemFactory} = require('../src/gilded_rose.js');

describe("Gilded Rose", function() {

  it('should lower the sellIn value daily', () => {
    const item = ItemFactory.createDefaultItem('foo', 1, 0);
    const gildedRose = new Shop([item]);

    const items = gildedRose.updateQuality();

    expect(items[0].sellIn).to.equal(0);
  });

  it('should lower the quality value daily', () => {
    const item = ItemFactory.createDefaultItem('foo', 1, 1);
    const gildedRose = new Shop([item]);

    const items = gildedRose.updateQuality();

    expect(items[0].quality).to.equal(0);
  });

  it('should not lower the quality value below 0', () => {
    const item = ItemFactory.createDefaultItem('foo', 1, 0);
    const gildedRose = new Shop([item]);

    const items = gildedRose.updateQuality();

    expect(items[0].quality).to.equal(0);
  });

  it('quality decreases twice as fast when sellIn has passed', () => {
    const item = ItemFactory.createDefaultItem('foo', 0, 2);
    const gildedRose = new Shop([item]);

    const items = gildedRose.updateQuality();

    expect(items[0].quality).to.equal(0);
  });

  describe('Aged Brie', () => {
    it('its quality increases day by day', () => {
      const agedBrie = ItemFactory.createAgedBrie(1, 0);
      const gildedRose = new Shop([agedBrie]);

      const [updatedAgedBrie] = gildedRose.updateQuality();

      expect(updatedAgedBrie.quality).to.equal(1);
    });

    it('its quality never exceeds 50', () => {
      const agedBrie = ItemFactory.createAgedBrie(1, 50);
      const gildedRose = new Shop([agedBrie]);

      const [updatedAgedBrie] = gildedRose.updateQuality();

      expect(updatedAgedBrie.quality).to.equal(50);
    })
  });

  describe('Sulfuras', () => {
    it('never looses quality', () => {
      const sulfura = ItemFactory.createSulfuras(3, 40);
      const gildedRose = new Shop([sulfura]);

      const [updatedSulfura] = gildedRose.updateQuality();

      expect(updatedSulfura.quality).to.equal(40);
    });

    it('never has to be sold', () => {
      const sulfura = ItemFactory.createSulfuras(3, 40);
      const gildedRose = new Shop([sulfura]);

      const [updatedSulfura] = gildedRose.updateQuality();

      expect(updatedSulfura.sellIn).to.equal(3);
    });
  });

  describe('Backstage passes', () => {
    it('increase in quality as sell in approaches', () => {
      const backstagePasses = ItemFactory.createBackstagePasses(30, 3);
      const gildedRose = new Shop([backstagePasses]);

      const [updatedBackstagePasses] = gildedRose.updateQuality();

      expect(updatedBackstagePasses.quality).to.equal(4);
    });

    it('increases twice as fast 10 days before sell in', () => {
      const backstagePasses = ItemFactory.createBackstagePasses(10, 3);
      const gildedRose = new Shop([backstagePasses]);

      const [updatedBackstagePasses] = gildedRose.updateQuality();

      expect(updatedBackstagePasses.quality).to.equal(5);
    });

    it('increases thrice as fast 5 days before sell in', () => {
      const backstagePasses = ItemFactory.createBackstagePasses(5, 3);
      const gildedRose = new Shop([backstagePasses]);

      const [updatedBackstagePasses] = gildedRose.updateQuality();

      expect(updatedBackstagePasses.quality).to.equal(6);
    });

    it('drops to 0 the day of the concert', () => {
      const backstagePasses = ItemFactory.createBackstagePasses(0, 3);
      const gildedRose = new Shop([backstagePasses]);

      const [updatedBackstagePasses] = gildedRose.updateQuality();

      expect(updatedBackstagePasses.quality).to.equal(0);
    });

    it('stays at 0 after the concert', () => {
      const backstagePasses = ItemFactory.createBackstagePasses(-1, 0);
      const gildedRose = new Shop([backstagePasses]);

      const [updatedBackstagePasses] = gildedRose.updateQuality();

      expect(updatedBackstagePasses.quality).to.equal(0);
      expect(updatedBackstagePasses.sellIn).to.equal(-2);
    });
  });

  describe('Conjured', () => {
    it('degrades twice as fast as other items', () => {
      const conjured = ItemFactory.createConjured(4, 3);
      const gildedRose = new Shop([conjured]);

      const [updatedConjured] = gildedRose.updateQuality();

      expect(updatedConjured.quality).to.equal(1);
    });
  });
});
