import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardSection, Button } from './components/common';
import { Actions } from 'react-native-router-flux';
//import Weather from './Weather';

const Settings = () => {
  return (
    <View style = {{ flex:1, backgroundColor: '#f9f9f9' }}>
      <View style = {{ flex:1, alignItems: 'stretch', marginTop:55, marginBottom:0 }}>
        <Card>
          <CardSection>
            <Text style = { styles.textStyle }>Settings Here</Text>

          </CardSection>
          <CardSection>
            <Text style = { styles.textStyle }>Settings Here</Text>
          </CardSection>
        </Card>

        <Card>
          <CardSection>
            <Text style = { styles.textStyle }>Settings Here</Text>
          </CardSection>
          <CardSection>
            <Text style = { styles.textStyle }>Settings Here</Text>
          </CardSection>
          <CardSection>
            <Text style = { styles.textStyle }>Settings Here</Text>
          </CardSection>
        </Card>


      </View>
      <View style = {{paddingBottom:20}}>
        <Button onPress = { () => Actions.pop() }>Save</Button>
      </View>
    </View>
  )
}

const styles = {
textStyle: {
  fontSize:15,
},

}

export default Settings;
