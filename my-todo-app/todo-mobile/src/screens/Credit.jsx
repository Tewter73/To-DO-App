import { View } from 'react-native'
import { Card, List, Text, Title } from 'react-native-paper'

const people = [
  {
    name: 'นายคุณานนต์ โสภาเจริญ',
    studentId: '6634406123',
  },
  {
    name: 'นายกิตติธัช ทวีผลสมเกียรติ',
    studentId: '6634403223',
  },
  {
    name: 'นายปภพ กิตติภิญโญชัย',
    studentId: '6634438223',
  },
]

export default function CreditScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Card>
        <Card.Content>
          <Title style={{ marginBottom: 4 }}>ผู้จัดทำ</Title>
          <Text style={{ marginBottom: 8 }}>รายชื่อทีมงานและรหัสนิสิต</Text>
          {people.map((person) => (
            <List.Item
              key={person.studentId}
              title={person.name}
              description={`รหัสนิสิต ${person.studentId}`}
            />
          ))}
        </Card.Content>
      </Card>
    </View>
  )
}
