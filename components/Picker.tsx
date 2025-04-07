import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  Platform
} from 'react-native';
import { colors } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { ChevronDown } from 'lucide-react-native';

interface PickerItem {
  label: string;
  value: any;
}

interface PickerProps {
  selectedValue: any;
  onValueChange: (value: any) => void;
  items: PickerItem[];
  placeholder?: string;
}

export const Picker: React.FC<PickerProps> = ({
  selectedValue,
  onValueChange,
  items,
  placeholder = 'Select an option'
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const selectedItem = items.find(item => item.value === selectedValue);
  
  const handleSelect = (value: any) => {
    onValueChange(value);
    setModalVisible(false);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.pickerButton} 
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.pickerText}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <ChevronDown size={20} color={colors.text} />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select an option</Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={items}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    selectedValue === item.value && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      selectedValue === item.value && styles.selectedOptionText
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
  },
  pickerText: {
    fontSize: 16,
    color: colors.text,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  optionsList: {
    paddingHorizontal: 20,
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: 'rgba(94, 204, 192, 0.1)',
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
});