// Collection.spec.ts
import { beforeEach, describe, expect, it } from 'vitest'
import { Collection } from '../collection'

describe('Collection', () => {
  let collection: Collection<HTMLElement>

  beforeEach(() => {
    collection = new Collection<HTMLElement>('myCollection')
  })

  //----------------------------------------------------------------------------------------------------
  // 📌 basic tests
  //----------------------------------------------------------------------------------------------------

  it('should correctly instantiate', () => {
    expect(collection).toBeInstanceOf(Collection)
  })

  it('should return all elements of the collection', () => {
    const templateRef1 = { value: document.createElement('div') }
    const templateRef2 = { value: document.createElement('span') }

    collection.add(templateRef1)
    collection.add(templateRef2)

    expect(collection.elements.value).toContainEqual(templateRef1.value)
    expect(collection.elements.value).toContainEqual(templateRef2.value)
  })

  //----------------------------------------------------------------------------------------------------
  // 📌 addition tests
  //----------------------------------------------------------------------------------------------------

  describe('add', () => {
    it('should add new item to the collection', () => {
      const item = collection.add({ value: document.createElement('div') })

      expect(collection.items.value).toHaveLength(1)
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('templateRef')
    })

    it('should correctly set the templateRef property of the item', () => {
      const templateRef = { value: document.createElement('div') }
      const item = collection.add(templateRef)
      expect(item.templateRef).toBe(templateRef)
    })

    it('should correctly set the disabled property if provided', () => {
      const templateRef = { value: document.createElement('div') }
      const item = collection.add(templateRef, () => true)
      expect(item.disabled()).toBe(true)
    })

    it('should ignore disabled property if not provided', () => {
      const templateRef = { value: document.createElement('div') }
      const item = collection.add(templateRef)
      expect(item.disabled).toBeUndefined()
    })

    it('should retain previously added items when a new item is added', () => {
      const item1 = { value: document.createElement('div') }
      const item2 = { value: document.createElement('span') }
      const item3 = { value: document.createElement('p') }
      collection.add(item1)
      collection.add(item2)
      collection.add(item3)
      expect(collection.elements.value).toContain(item1.value)
      expect(collection.elements.value).toContain(item2.value)
      expect(collection.elements.value).toContain(item3.value)
    })
  })

  //----------------------------------------------------------------------------------------------------
  // 📌 removal tests
  //----------------------------------------------------------------------------------------------------

  describe('remove', () => {
    it('should remove item from the collection', () => {
      const templateRef = { value: document.createElement('div') }
      const item = collection.add(templateRef)

      expect(collection.items.value).toContainEqual(item)

      collection.remove(templateRef)

      expect(collection.items.value).not.toContainEqual(item)
    })

    it('should decrement the count when an item is removed', () => {
      const templateRef = { value: document.createElement('div') }
      const item = collection.add(templateRef)
      collection.remove(templateRef)
      expect(collection.items.value.length).toBe(0)
    })

    it('should correctly remove the item with the specified templateRef', () => {
      const templateRef1 = { value: document.createElement('div') }
      const templateRef2 = { value: document.createElement('span') }
      const item1 = collection.add(templateRef1)
      const item2 = collection.add(templateRef2)
      collection.remove(templateRef1)
      expect(collection.items.value).toContain(item2)
      expect(collection.items.value).not.toContain(item1)
    })

    it('should do nothing when trying to remove an item with invalid templateRef', () => {
      const templateRef1 = { value: document.createElement('div') }
      const templateRef2 = { value: document.createElement('span') }
      const item1 = collection.add(templateRef1)

      expect(collection.items.value).toContain(item1)
      expect(collection.items.value.length).toBe(1)
    })
  })

  //----------------------------------------------------------------------------------------------------
  // 📌 id tests
  //----------------------------------------------------------------------------------------------------

  describe('id', () => {
    it('should generate incremental id for each item', () => {
      const templateRef1 = { value: document.createElement('div') }
      const templateRef2 = { value: document.createElement('div') }
      const templateRef3 = { value: document.createElement('div') }

      const item1 = collection.add(templateRef1)
      const item2 = collection.add(templateRef2)
      const item3 = collection.add(templateRef3)

      expect(item1.id).toBe('myCollection-0')
      expect(item2.id).toBe('myCollection-1')
      expect(item3.id).toBe('myCollection-2')
    })

    it('should keep increasing id after removing items', () => {
      const templateRef1 = { value: document.createElement('div') }

      collection.add(templateRef1)
      collection.remove(templateRef1)

      // Add new item and check id, id should be 'myCollection-1' not 'myCollection-0'
      const item = collection.add({ value: document.createElement('div') })
      expect(item.id).toBe('myCollection-1')
    })

    it('should generate id starting with the collection name', () => {
      const customCollection = new Collection<HTMLElement>('customID')
      const item = customCollection.add({ value: document.createElement('div') })
      expect(item.id.startsWith('customID')).toBe(true)
    })

    it('should generate incremental id for each collection instance separately', () => {
      // One instance
      const collection1 = new Collection<HTMLElement>('instance1')
      collection1.add({ value: document.createElement('div') })
      const item2 = collection1.add({ value: document.createElement('div') })
      expect(item2.id).toBe('instance1-1')

      // Another instance
      const collection2 = new Collection<HTMLElement>('instance2')
      const item1inInstance2 = collection2.add({ value: document.createElement('div') })
      expect(item1inInstance2.id).toBe('instance2-0')
    })

    it('should generate an id which includes the collection id', () => {
      const item = collection.add({ value: document.createElement('div') })
      expect(item.id.includes('myCollection')).toBe(true)
    })
  })
})
