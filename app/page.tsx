import { Avatar } from "@/components/ui/avatar";
import { Badge, BadgeCircle } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/bar";
import { Button } from "@/components/ui/button";
import { IconShape } from "@/components/ui/icon-shape";
import { Logo } from "@/components/ui/logo";
import { Pagination } from "@/components/ui/pagination";
import { ChevronRight, ExternalLinkIcon, Link, User } from "lucide-react";



export default function Home() {
  return (
    <main className="p-5 max-w-7xl m-auto flex flex-col gap-5 bg-white">

      <div className="grid grid-cols-3 gap-10">

      <Button variant="solid" size="sm" intent="primary">Button solid primary sm</Button>
      <Button variant="solid" size="sm" intent="secondary">Button solid secondary sm</Button>
      <Button variant="solid" size="sm" intent="success">Button solid success sm</Button>
      <Button variant="solid" size="sm" intent="danger">Button solid danger sm</Button>
      <Button variant="solid" size="sm" intent="neutral">Button solid neutral sm</Button>


      <Button variant="solid" size="md" intent="primary">Button solid primary md</Button>
      <Button variant="solid" size="md" intent="secondary">Button solid secondary md</Button>
      <Button variant="solid" size="md" intent="success">Button solid success md</Button>
      <Button variant="solid" size="md" intent="danger">Button solid danger md</Button>
      <Button variant="solid" size="md" intent="neutral">Button solid neutral md</Button>

      <Button variant="solid" size="lg" intent="primary">Button solid primary lg</Button>
      <Button variant="solid" size="lg" intent="secondary">Button solid secondary lg</Button>
      <Button variant="solid" size="lg" intent="success">Button solid success lg</Button>
      <Button variant="solid" size="lg" intent="danger">Button solid danger lg</Button>
      <Button variant="solid" size="lg" intent="neutral">Button solid neutral lg</Button>

   
      <Button variant="outline" size="sm" intent="primary">Button outline primary sm</Button>
      <Button variant="outline" size="sm" intent="secondary">Button outline secondary sm</Button>
      <Button variant="outline" size="sm" intent="success">Button outline success sm</Button>
      <Button variant="outline" size="sm" intent="danger">Button outline danger sm</Button>
      <Button variant="outline" size="sm" intent="neutral">Button solid neutral sm</Button>

      <Button variant="outline" size="md" intent="primary">Button outline primary md</Button>
      <Button variant="outline" size="md" intent="secondary">Button outline secondary md</Button>
      <Button variant="outline" size="md" intent="success">Button outline success md</Button>
      <Button variant="outline" size="md" intent="danger">Button outline danger md</Button>
      <Button variant="outline" size="md" intent="neutral">Button solid neutral md</Button>
      
      <Button variant="outline" size="lg" intent="primary">Button outline primary lg</Button>
      <Button variant="outline" size="lg" intent="secondary">Button outline secondary lg</Button>
      <Button variant="outline" size="lg" intent="success">Button outline success lg</Button>
      <Button variant="outline" size="lg" intent="danger">Button outline danger lg</Button>
      <Button variant="outline" size="lg" intent="neutral">Button solid neutral lg</Button>

      <Button variant="ghost" size="sm" intent="primary">Button ghost primary sm</Button>
      <Button variant="ghost" size="sm" intent="secondary">Button ghost secondary sm</Button>
      <Button variant="ghost" size="sm" intent="success">Button ghost success sm</Button>
      <Button variant="ghost" size="sm" intent="danger">Button ghost danger sm</Button>
      <Button variant="ghost" size="sm" intent="neutral">Button ghost neutral sm</Button>

      <Button variant="ghost" size="md" intent="primary">Button ghost primary md</Button>
      <Button variant="ghost" size="md" intent="secondary">Button ghost secondary md</Button>
      <Button variant="ghost" size="md" intent="success">Button ghost success md</Button>
      <Button variant="ghost" size="md" intent="danger">Button ghost danger md</Button>
      <Button variant="ghost" size="md" intent="neutral">Button ghost neutral md</Button>

      <Button variant="ghost" size="lg" intent="primary">Button ghost primary lg</Button>
      <Button variant="ghost" size="lg" intent="secondary">Button ghost secondary lg</Button>
      <Button variant="ghost" size="lg" intent="success">Button ghost success lg</Button>
      <Button variant="ghost" size="lg" intent="danger">Button ghost danger lg</Button>
      <Button variant="ghost" size="lg" intent="neutral">Button ghost neutral lg</Button>



      



      <Button disabled variant="solid" size="sm" intent="primary">Button solid primary sm disabled</Button>
      <Button disabled variant="solid" size="sm" intent="secondary">Button solid secondary sm disabled</Button>
      <Button disabled variant="solid" size="sm" intent="success">Button solid success sm disabled</Button>
      <Button disabled variant="solid" size="sm" intent="danger">Button solid danger sm disabled</Button>
      <Button disabled variant="solid" size="sm" intent="neutral">Button solid neutral sm disabled</Button>


      <Button disabled variant="solid" size="md" intent="primary">Button solid primary md disabled</Button>
      <Button disabled variant="solid" size="md" intent="secondary">Button solid secondary md disabled</Button>
      <Button disabled variant="solid" size="md" intent="success">Button solid success md disabled</Button>
      <Button disabled variant="solid" size="md" intent="danger">Button solid danger md disabled</Button>
      <Button disabled variant="solid" size="md" intent="neutral">Button solid neutral md disabled</Button>

      <Button disabled variant="solid" size="lg" intent="primary">Button solid primary lg disabled</Button>
      <Button disabled variant="solid" size="lg" intent="secondary">Button solid secondary lg disabled</Button>
      <Button disabled variant="solid" size="lg" intent="success">Button solid success lg disabled</Button>
      <Button disabled variant="solid" size="lg" intent="danger">Button solid danger lg disabled</Button>
      <Button disabled variant="solid" size="lg" intent="neutral">Button solid neutral lg disabled</Button>

   
      <Button disabled variant="outline" size="sm" intent="primary">Button outline primary sm disabled</Button>
      <Button disabled variant="outline" size="sm" intent="secondary">Button outline secondary sm disabled</Button>
      <Button disabled variant="outline" size="sm" intent="success">Button outline success sm disabled</Button>
      <Button disabled variant="outline" size="sm" intent="danger">Button outline danger sm disabled</Button>
      <Button disabled variant="outline" size="sm" intent="neutral">Button solid neutral sm disabled</Button>

      <Button disabled variant="outline" size="md" intent="primary">Button outline primary md disabled</Button>
      <Button disabled variant="outline" size="md" intent="secondary">Button outline secondary md disabled</Button>
      <Button disabled variant="outline" size="md" intent="success">Button outline success md disabled</Button>
      <Button disabled variant="outline" size="md" intent="danger">Button outline danger md disabled</Button>
      <Button disabled variant="outline" size="md" intent="neutral">Button solid neutral md disabled</Button>
      
      <Button disabled variant="outline" size="lg" intent="primary">Button outline primary lg disabled</Button>
      <Button disabled variant="outline" size="lg" intent="secondary">Button outline secondary lg disabled</Button>
      <Button disabled variant="outline" size="lg" intent="success">Button outline success lg disabled</Button>
      <Button disabled variant="outline" size="lg" intent="danger">Button outline danger lg disabled</Button>
      <Button disabled variant="outline" size="lg" intent="neutral">Button solid neutral lg disabled</Button>

      <Button disabled variant="ghost" size="sm" intent="primary">Button ghost primary sm disabled</Button>
      <Button disabled variant="ghost" size="sm" intent="secondary">Button ghost secondary sm disabled</Button>
      <Button disabled variant="ghost" size="sm" intent="success">Button ghost success sm disabled</Button>
      <Button disabled variant="ghost" size="sm" intent="danger">Button ghost danger sm disabled</Button>
      <Button disabled variant="ghost" size="sm" intent="neutral">Button ghost neutral sm disabled</Button>

      <Button disabled variant="ghost" size="md" intent="primary">Button ghost primary md disabled</Button>
      <Button disabled variant="ghost" size="md" intent="secondary">Button ghost secondary md disabled</Button>
      <Button disabled variant="ghost" size="md" intent="success">Button ghost success md disabled</Button>
      <Button disabled variant="ghost" size="md" intent="danger">Button ghost danger md disabled</Button>
      <Button disabled variant="ghost" size="md" intent="neutral">Button ghost neutral md disabled</Button>

      <Button disabled variant="ghost" size="lg" intent="primary">Button ghost primary lg disabled</Button>
      <Button disabled variant="ghost" size="lg" intent="secondary">Button ghost secondary lg disabled</Button>
      <Button disabled variant="ghost" size="lg" intent="success">Button ghost success lg disabled</Button>
      <Button disabled variant="ghost" size="lg" intent="danger">Button ghost danger lg disabled</Button>
      <Button disabled variant="ghost" size="lg" intent="neutral">Button ghost neutral lg disabled</Button>




      <Button loading variant="solid" size="sm" intent="primary">Button solid primary sm loading</Button>
      <Button loading variant="solid" size="sm" intent="secondary">Button solid secondary sm loading</Button>
      <Button loading variant="solid" size="sm" intent="success">Button solid success sm loading</Button>
      <Button loading variant="solid" size="sm" intent="danger">Button solid danger sm loading</Button>
      <Button loading variant="solid" size="sm" intent="neutral">Button solid neutral sm loading</Button>


      <Button loading variant="solid" size="md" intent="primary">Button solid primary md loading</Button>
      <Button loading variant="solid" size="md" intent="secondary">Button solid secondary md loading</Button>
      <Button loading variant="solid" size="md" intent="success">Button solid success md loading</Button>
      <Button loading variant="solid" size="md" intent="danger">Button solid danger md loading</Button>
      <Button loading variant="solid" size="md" intent="neutral">Button solid neutral md loading</Button>

      <Button loading variant="solid" size="lg" intent="primary">Button solid primary lg loading</Button>
      <Button loading variant="solid" size="lg" intent="secondary">Button solid secondary lg loading</Button>
      <Button loading variant="solid" size="lg" intent="success">Button solid success lg loading</Button>
      <Button loading variant="solid" size="lg" intent="danger">Button solid danger lg loading</Button>
      <Button loading variant="solid" size="lg" intent="neutral">Button solid neutral lg loading</Button>

   
      <Button loading variant="outline" size="sm" intent="primary">Button outline primary sm loading</Button>
      <Button loading variant="outline" size="sm" intent="secondary">Button outline secondary sm loading</Button>
      <Button loading variant="outline" size="sm" intent="success">Button outline success sm loading</Button>
      <Button loading variant="outline" size="sm" intent="danger">Button outline danger sm loading</Button>
      <Button loading variant="outline" size="sm" intent="neutral">Button solid neutral sm loading</Button>

      <Button loading variant="outline" size="md" intent="primary">Button outline primary md loading</Button>
      <Button loading variant="outline" size="md" intent="secondary">Button outline secondary md loading</Button>
      <Button loading variant="outline" size="md" intent="success">Button outline success md loading</Button>
      <Button loading variant="outline" size="md" intent="danger">Button outline danger md loading</Button>
      <Button loading variant="outline" size="md" intent="neutral">Button solid neutral md loading</Button>
      
      <Button loading variant="outline" size="lg" intent="primary">Button outline primary lg loading</Button>
      <Button loading variant="outline" size="lg" intent="secondary">Button outline secondary lg loading</Button>
      <Button loading variant="outline" size="lg" intent="success">Button outline success lg loading</Button>
      <Button loading variant="outline" size="lg" intent="danger">Button outline danger lg loading</Button>
      <Button loading variant="outline" size="lg" intent="neutral">Button solid neutral lg loading</Button>

      <Button loading variant="ghost" size="sm" intent="primary">Button ghost primary sm loading</Button>
      <Button loading variant="ghost" size="sm" intent="secondary">Button ghost secondary sm loading</Button>
      <Button loading variant="ghost" size="sm" intent="success">Button ghost success sm loading</Button>
      <Button loading variant="ghost" size="sm" intent="danger">Button ghost danger sm loading</Button>
      <Button loading variant="ghost" size="sm" intent="neutral">Button ghost neutral sm loading</Button>

      <Button loading variant="ghost" size="md" intent="primary">Button ghost primary md loading</Button>
      <Button loading variant="ghost" size="md" intent="secondary">Button ghost secondary md loading</Button>
      <Button loading variant="ghost" size="md" intent="success">Button ghost success md loading</Button>
      <Button loading variant="ghost" size="md" intent="danger">Button ghost danger md loading</Button>
      <Button loading variant="ghost" size="md" intent="neutral">Button ghost neutral md loading</Button>

      <Button loading variant="ghost" size="lg" intent="primary">Button ghost primary lg loading</Button>
      <Button loading variant="ghost" size="lg" intent="secondary">Button ghost secondary lg loading</Button>
      <Button loading variant="ghost" size="lg" intent="success">Button ghost success lg loading</Button>
      <Button loading variant="ghost" size="lg" intent="danger">Button ghost danger lg loading</Button>
      <Button loading variant="ghost" size="lg" intent="neutral">Button ghost neutral lg loading</Button>



      </div>


      <h2>Avatar</h2>

      <div className="grid grid-cols-3 gap-10">

      <Avatar size="sm"/>
      <Avatar size="md"/>
      <Avatar size="lg"/>

      </div>

      <h2>Badge</h2>

      <Badge intent="success" variant="solid">Success solid</Badge>
      <Badge intent="success" variant="soft">Success soft</Badge>
      <Badge intent="success" variant="outline">Success outline</Badge>
      <Badge intent="error" variant="solid">Error solid</Badge>
      <Badge intent="error" variant="soft">Error soft</Badge>
      <Badge intent="error" variant="outline">Error outline</Badge>
      <Badge intent="warning" variant="solid">Warning solid</Badge>
      <Badge intent="warning" variant="soft">Warning soft</Badge>
      <Badge intent="warning" variant="outline">Warning outline</Badge>
      <Badge intent="info" variant="solid">Info solid</Badge>
      <Badge intent="info" variant="soft">Info soft</Badge>
      <Badge intent="info" variant="outline">Info outline</Badge>
      <Badge intent="neutral" variant="solid">Neutral solid</Badge>
      <Badge intent="neutral" variant="soft">Neutral soft</Badge>
      <Badge intent="neutral" variant="outline">Neutral outline</Badge>


      <h2>Progress Bar</h2>
      <ProgressBar value={10} showLabel={false}/>
      <ProgressBar value={20} size="sm"/>
      <ProgressBar value={30} size="md"/>
      <ProgressBar value={40} size="lg"/>

      <ProgressBar value={50} intent="auto"/>

      <ProgressBar value={100} intent="success"/>
      <ProgressBar value={100} intent="error"/>
      <ProgressBar value={100} intent="warning"/>
      <ProgressBar value={100} intent="info"/>

      <h2>Icon Shape</h2>

      <IconShape icon={User} color="red" shape="circle" />
      <IconShape icon={User} color="green" shape="circle" />
      <IconShape icon={User} color="yellow" shape="circle" />
      <IconShape icon={User} color="blue" shape="circle" />
      <IconShape icon={User} color="purple" shape="circle" />
      <IconShape icon={User} color="orange" shape="circle" />
      <IconShape icon={User} color="gray" shape="circle"/>

      <IconShape icon={User} color="red" shape="square" />
      <IconShape icon={User} color="green" shape="square" />
      <IconShape icon={User} color="yellow" shape="square" />
      <IconShape icon={User} color="blue" shape="square" />
      <IconShape icon={User} color="purple" shape="square" />
      <IconShape icon={User} color="orange" shape="square" />
      <IconShape icon={User} color="gray" shape="square"/>

      <IconShape icon={User} color="red" shape="rounded" />
      <IconShape icon={User} color="green" shape="rounded" />
      <IconShape icon={User} color="yellow" shape="rounded" />
      <IconShape icon={User} color="blue" shape="rounded" />
      <IconShape icon={User} color="purple" shape="rounded" />
      <IconShape icon={User} color="orange" shape="rounded" />
      <IconShape icon={User} color="gray" shape="rounded"/>
      
      <h2>Logo</h2>

      <Logo/>
      <Logo title="Page name"/>

      <h2>Pagination</h2>

      <Pagination page={1} totalPages={10} />
      <Pagination page={5} totalPages={10} />
      <Pagination page={10} totalPages={10} />

    </main>
  );
}
