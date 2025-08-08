import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, Modal, TouchableOpacity } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { getProductsByCategory } from './api/getProducts'
import { screenHeight } from '@utils/Constants'
import { RFValue } from 'react-native-responsive-fontsize'
import SearchBar from './atoms/SearchBar'
import ProductItem from './atoms/ProductItem'
import { useAppSelector } from '@store/reduxHook'
import { selectTotalItemsInCart } from '@modules/cart/api/slice'
import { Picker } from '@react-native-picker/picker'
import axios from 'axios'
import Slider from '@react-native-community/slider';

const Products: FC = () => {
    const route = useRoute()
    const category = route.params as { id: number; name: string };
    const count =useAppSelector(selectTotalItemsInCart)
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState({ color: '', size: '', brand: '', minPrice: '', maxPrice: '' })
    const [sort, setSort] = useState('')
    const [availableColors, setAvailableColors] = useState<string[]>([])
    const [availableSizes, setAvailableSizes] = useState<string[]>([])
    const [availableBrands, setAvailableBrands] = useState<string[]>([])
    const [filterModalVisible, setFilterModalVisible] = useState(false)
    const [sortModalVisible, setSortModalVisible] = useState(false)

    const BASE_URL = 'http://10.0.2.2:3000'; 

    // Fetch available filter options (colors, sizes, brands) from products
    const fetchFilterOptions = (products: any[]) => {
        const colors = Array.from(new Set(products.map(p => p.color).filter(Boolean)))
        const sizes = Array.from(new Set(products.flatMap(p => (p.productSizes || []).map((ps: any) => ps.size)).filter(Boolean)))
        const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)))
        setAvailableColors(colors)
        setAvailableSizes(sizes)
        setAvailableBrands(brands)
    }

    // Add endpoints for fetching filter options
    const fetchBrands = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/product/brands`, { params: { categoryId: category.id } });
            setAvailableBrands(res.data?.data || []);
        } catch {}
    };
    const fetchColors = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/product/colours`, { params: { categoryId: category.id } });
            setAvailableColors(res.data?.data || []);
        } catch {}
    };
    const fetchSizes = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/product/sizes`, { params: { categoryId: category.id } });
            setAvailableSizes(res.data?.data || []);
        } catch {}
    };

    // Fetch available options from DB when dropdown is opened
    const fetchAvailableOptions = async (type: 'color' | 'size' | 'brand') => {
        try {
            const params: any = { categoryId: category.id }
            const res = await axios.get(`${BASE_URL}/product/filter?categoryId=${category.id}`)
            const data = res.data?.data || []
            if (type === 'color') setAvailableColors(Array.from(new Set(data.map((p: any) => p.color).filter(Boolean))))
            if (type === 'size') setAvailableSizes(Array.from(new Set(data.flatMap((p: any) => (p.productSizes || []).map((ps: any) => ps.size)).filter(Boolean))))
            if (type === 'brand') setAvailableBrands(Array.from(new Set(data.map((p: any) => p.brand).filter(Boolean))))
        } catch {}
    }

    const fetchProducts = async (useFilter = false) => {
        setLoading(true)
        try {
            let data = [];
            if (useFilter && (filter.color || filter.size || filter.brand || filter.minPrice || filter.maxPrice)) {
                const params: any = { categoryId: category.id }
                if (filter.color) params.color = filter.color
                if (filter.size) params.size = filter.size
                if (filter.brand) params.brand = filter.brand
                if (filter.minPrice) params.minPrice = filter.minPrice
                if (filter.maxPrice) params.maxPrice = filter.maxPrice
                const res = await axios.get(`${BASE_URL}/product/filter`, { params })
                data = res.data?.data || []
            } else {
                const res = await axios.get(`${BASE_URL}/product/category/${category.id}`)
                data = res.data?.data || []
            }
            fetchFilterOptions(data)
            // Client-side sort
            if (sort === 'priceLowHigh') data = data.slice().sort((a: { price: number }, b: { price: number }) => a.price - b.price)
            if (sort === 'priceHighLow') data = data.slice().sort((a: { price: number }, b: { price: number }) => b.price - a.price)
            if (sort === 'rating') data = data.slice().sort((a: { rating: any }, b: { rating: any }) => (b.rating || 0) - (a.rating || 0))
            if (sort === 'name') data = data.slice().sort((a: { name: string }, b: { name: any }) => a.name.localeCompare(b.name))
            setProducts(data)
        } catch (e) {
            setProducts([])
        }
        setLoading(false)
    }


    useEffect(() => {
        if (category?.id) {
            fetchProducts(false)
        }
    }, [category?.id])

    const renderitem = ({item, index}:any) => {
        const isOdd = index % 2 !== 0
        return (
            <ProductItem isOdd={isOdd} item={item} />
        )
    }

    return (
        <View style={styles.container}>
            <SafeAreaView />
            <SearchBar cartLength={count} />

            {/* Filters and Sort Buttons */}
            <View style={{ flexDirection: 'row', marginHorizontal: 10, marginTop: 10 }}>
                {/* Filter Button */}
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: '#7B1FA2',
                        padding: 12,
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                        alignItems: 'center',
                    }}
                    onPress={() => setFilterModalVisible(true)}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Filters</Text>
                </TouchableOpacity>

                {/* Separator */}
                <View style={{ width: 2, backgroundColor: '#fff' }} />

                {/* Sort Button */}
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: '#7B1FA2',
                        padding: 12,
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                        alignItems: 'center',
                    }}
                    onPress={() => setSortModalVisible(true)}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sort</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 10 }} />

            {/* Filter Modal */}
            <Modal
                visible={filterModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#222' }}>Filters</Text>

                        {/* Brand */}
                        <Text style={{ fontSize: 15, color: '#222', marginBottom: 4 }}>Brand</Text>
                        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 }}>
                            <Picker
                                selectedValue={filter.brand}
                                onValueChange={v => setFilter(f => ({ ...f, brand: v }))}
                                onFocus={fetchBrands}
                                style={{ color: '#222' }}
                            >
                                <Picker.Item label="Select Brand" value="" />
                                {availableBrands.map(b => <Picker.Item key={b} label={b} value={b} />)}
                            </Picker>
                        </View>

                        {/* Size */}
                        <Text style={{ fontSize: 15, color: '#222', marginBottom: 4 }}>Size</Text>
                        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 }}>
                            <Picker
                                selectedValue={filter.size}
                                onValueChange={v => setFilter(f => ({ ...f, size: v }))}
                                onFocus={fetchSizes}
                                style={{ color: '#222' }}
                            >
                                <Picker.Item label="Select Size" value="" />
                                {availableSizes.map(s => <Picker.Item key={s} label={s} value={s} />)}
                            </Picker>
                        </View>

                        {/* Colour */}
                        <Text style={{ fontSize: 15, color: '#222', marginBottom: 4 }}>Colour</Text>
                        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 }}>
                            <Picker
                                selectedValue={filter.color}
                                onValueChange={v => setFilter(f => ({ ...f, color: v }))}
                                onFocus={fetchColors}
                                style={{ color: '#222' }}
                            >
                                <Picker.Item label="Select Colour" value="" />
                                {availableColors.map(c => <Picker.Item key={c} label={c} value={c} />)}
                            </Picker>
                        </View>
                            {/* Price Range Slider */}
                            <Text style={{ fontSize: 15, color: '#222', marginBottom: 4 }}>Price Range</Text>
                            <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={10000}
                            step={100}
                            minimumTrackTintColor="#7B1FA2"
                            maximumTrackTintColor="#ddd"
                            thumbTintColor="#fff"
                            value={Number(filter.maxPrice) || 10000}
                            onValueChange={(value) => setFilter(f => ({ ...f, maxPrice: value.toString() }))}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#555', fontSize: 13 }}>Min: ₹0</Text>
                            <Text style={{ color: '#555', fontSize: 13 }}>Max: ₹{filter.maxPrice || '10000'}</Text>
                        </View>


                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#7B1FA2', padding: 12, borderRadius: 8, marginRight: 10 }}
                                onPress={() => { setFilterModalVisible(false); fetchProducts(true); }}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Apply</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: '#ccc', padding: 12, borderRadius: 8 }}
                                onPress={() => {
                                    setFilter({ color: '', size: '', brand: '', minPrice: '', maxPrice: '' });
                                    setFilterModalVisible(false);
                                    fetchProducts(false);
                                }}
                            >
                                <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 16 }}>Clear</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Sort Modal */}
            <Modal
                visible={sortModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setSortModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#222' }}>Sort</Text>
                        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 }}>
                            <Picker
                                selectedValue={sort}
                                onValueChange={setSort}
                                style={{ color: '#222' }}
                            >
                                <Picker.Item label="Sort By" value="" />
                                <Picker.Item label="Price: Low to High" value="priceLowHigh" />
                                <Picker.Item label="Price: High to Low" value="priceHighLow" />
                            </Picker>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#7B1FA2', padding: 12, borderRadius: 8, marginRight: 10 }}
                                onPress={() => { setSortModalVisible(false); fetchProducts(); }}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Apply</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: '#ccc', padding: 12, borderRadius: 8 }}
                                onPress={() => { setSort(''); setSortModalVisible(false); fetchProducts(); }}
                            >
                                <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 16 }}>Clear</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {!loading && (
                <FlatList
                    bounces={false}
                    data={products}
                    renderItem={renderitem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Oops! No items in this category</Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContainer}
                    ListFooterComponent={
                        !loading && products.length > 0 ? (
                            <View style={styles.footerContainer}>
                                <Text style={styles.footerText}> That's it for this category </Text>
                            </View>
                        ) : null
                    }
                />
            )}
            {loading && (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    listContainer: {
        paddingBottom: 30,
        backgroundColor: "#fff",
    },
    emptyContainer: {
        height: screenHeight - 80,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: RFValue(14),
        color: '#666',
        marginBottom: 16,
    },
    footerContainer: {
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        color: 'gray',
        fontSize: 14,
        fontStyle: 'italic',
    },
})

export default Products