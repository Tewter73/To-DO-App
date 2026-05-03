import { View } from 'react-native'
import { Card, List, Text, Title } from 'react-native-paper'
import { layout, palette, shadows } from '../ui/design'

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
    <View style={{ flex: 1, padding: layout.pagePadding, backgroundColor: palette.background }}>
      <Card style={{ marginBottom: 16, borderRadius: layout.cardRadius, backgroundColor: palette.primary, ...shadows.medium }}>
        <Card.Content style={{ padding: 20 }}>
          <Text variant="labelLarge" style={{ color: '#E0E7FF', letterSpacing: 1 }}>PROJECT TEAM</Text>
          <Title style={{ marginBottom: 4, color: '#FFFFFF', fontSize: 24, fontWeight: '800' }}>Credits</Title>
          <Text style={{ color: '#C7D2FE', fontWeight: '500' }}>ทีมพัฒนาและผู้รับผิดชอบระบบ</Text>
        </Card.Content>
      </Card>
      <Card style={{ borderRadius: layout.cardRadius, backgroundColor: palette.surface, ...shadows.soft }}>
        <Card.Content style={{ padding: 20 }}>
          <Title style={{ marginBottom: 4, fontSize: 18, fontWeight: '700' }}>ผู้จัดทำ</Title>
          <Text style={{ marginBottom: 8, color: palette.textSecondary }}>รายชื่อทีมงานและรหัสนิสิต</Text>
          {people.map((person) => (
            <List.Item
              key={person.studentId}
              title={person.name}
              description={`รหัสนิสิต ${person.studentId}`}
              left={() => <List.Icon icon="account-circle-outline" color={palette.primary} />}
            />
          ))}
        </Card.Content>
      </Card>
    </View>
  )
}
