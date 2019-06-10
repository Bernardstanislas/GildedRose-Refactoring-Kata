const sulfuraName = 'Sulfuras, Hand of Ragnaros';
const conjuredName = 'Conjured';
const agedBrieName = 'Aged Brie';
const backstagePassesName = 'Backstage passes to a TAFKAL80ETC concert';

class ItemFactory {
  static createDefaultItem(name, sellIn, quality) {
    return new Item(
        name,
        sellIn,
        quality,
        new DefaultAgingStrategy(),
        new DefaultQualityUpdateStrategy()
    );
  }

  static createSulfuras(sellIn, quality) {
    return new Item(
        sulfuraName,
        sellIn,
        quality,
        new NoAgingStrategy(),
        new ImmutableQualityUpdateStrategy()
    );
  }

  static createConjured(sellIn, quality) {
    return new Item(
        conjuredName,
        sellIn,
        quality,
        new DefaultAgingStrategy(),
        new FastDecreaseQualityUpdateStrategy()
    )
  }

  static createAgedBrie(sellIn, quality) {
    return new Item(
        agedBrieName,
        sellIn,
        quality,
        new DefaultAgingStrategy(),
        new IncreaseQualityUpdateStrategy()
    );
  }

  static createBackstagePasses(sellIn, quality) {
    return new Item(
        backstagePassesName,
        sellIn,
        quality,
        new DefaultAgingStrategy(),
        new ThresheldIncreaseQualityUpdateStrategy()
    );
  }
}

class Item {
  constructor(name, sellIn, quality, agingStrategy, qualityUpdateStrategy){
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
    this.agingStrategy = agingStrategy;
    this.updateQualityStrategy = qualityUpdateStrategy;
  }

  age() {
    this.agingStrategy.ageItem(this);
  }

  updateQuality() {
    this.updateQualityStrategy.updateItemQuality(this);
  }
}

class Shop {
  constructor(items=[]){
    this.items = items;
  }
  updateQuality() {
    this.items = this.items.map(item => {
      item.age();
      item.updateQuality();

      return item;
    });

    return this.items;
  }
}

class AgingStrategy {
  ageItem(item) {
    throw new Error('Aging strategy must implement ageItem method');
  }
}

class DefaultAgingStrategy extends AgingStrategy {
  ageItem(item) {
    item.sellIn -= 1;
  }
}

class NoAgingStrategy extends AgingStrategy {
  ageItem(item) {
    // No-op
  }
}

class QualityUpdateStrategy {
  updateItemQuality(item) {
    throw new Error('Quality update strategy must implement updateItemQuality method');
  }
}

class DefaultQualityUpdateStrategy extends QualityUpdateStrategy {
  updateItemQuality(item) {
    if (item.quality > 0) {
      item.quality -= 1;
    }
    if (item.sellIn < 0) {
      item.quality -= 1;
    }
  }
}

class ImmutableQualityUpdateStrategy extends QualityUpdateStrategy {
  updateItemQuality(item) {
    // No-op
  }
}

class FastDecreaseQualityUpdateStrategy extends DefaultQualityUpdateStrategy {
  updateItemQuality(item) {
    super.updateItemQuality(item);
    super.updateItemQuality(item);
  }
}

class IncreaseQualityUpdateStrategy extends QualityUpdateStrategy {
  updateItemQuality(item) {
    if (item.quality < 50) {
      item.quality += 1;
    }
  }
}

class ThresheldIncreaseQualityUpdateStrategy extends IncreaseQualityUpdateStrategy {
  updateItemQuality(item) {
    if (item.sellIn > 10) {
      super.updateItemQuality(item);
    } else if (item.sellIn > 5) {
      super.updateItemQuality(item);
      super.updateItemQuality(item);
    } else if (item.sellIn > 0) {
      super.updateItemQuality(item);
      super.updateItemQuality(item);
      super.updateItemQuality(item);
    } else {
      item.quality = 0;
    }
  }
}

module.exports = {
  Item,
  Shop,
  ItemFactory
}
