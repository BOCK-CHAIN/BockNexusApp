import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TextInput, Pressable, Image } from 'react-native';
import Icon from '@components/atoms/Icon';
import ProductItem from '@modules/products/atoms/ProductItem';
import { goBack } from '@navigation/NavigationUtil';
import axios from 'axios';

const BASE_URL = 'http://10.0.2.2:3000';

const SearchResults = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.get(`${BASE_URL}/product/search`, { params: { query } });
      setResults(res.data?.data || []);
    } catch (e) {
      setResults([]);
    }
    setLoading(false);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <ProductItem item={item} isOdd={index % 2 !== 0} />
  );

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={styles.searchBarContainer}>
        <Pressable onPress={goBack}>
          <Icon size={24} name="arrow-left" iconFamily="MaterialCommunityIcons" color="#000" />
        </Pressable>
        <View style={styles.searchInputContainer}>
          <Icon size={20} name="search" iconFamily="MaterialIcons" color="#000" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Products"
            placeholderTextColor="#666"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus
          />
        </View>
        <Pressable onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Go</Text>
        </Pressable>
      </View>
      <View style={{ height: 10 }} />
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#7B1FA2" />
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            searched && !loading ? (
              <View style={styles.centered}>
                <Text style={styles.emptyText}>No products found.</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 5,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    width: '70%',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  searchButton: {
    backgroundColor: '#7B1FA2',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 40,
  },
});

export default SearchResults; 